import axios from "axios";
import NodeCache from "node-cache";

// Inicializamos la caché
const cache = new NodeCache({ stdTTL: 3600 });

// Colecciones permitidas explícitamente (evita exponer un proxy abierto).
const ALLOWED_COLLECTION_ENDPOINTS = new Set([
  "genres",
  "platforms",
  "developers",
  "publishers",
  "stores",
  "tags",
]);

// Cliente HTTP dedicado para RAWG con timeout de seguridad.
const rawgClient = axios.create({
  baseURL: process.env.RAWG_BASE_URL,
  timeout: 8000,
});

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeQueryParams = (query = {}) => {
  const page = Number(query.page);
  const pageSize = Number(query.page_size);

  if (query.page !== undefined && (!Number.isInteger(page) || page < 1)) {
    throw createHttpError(400, "El parámetro 'page' debe ser un entero mayor o igual a 1.");
  }

  if (
    query.page_size !== undefined &&
    (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 40)
  ) {
    throw createHttpError(
      400,
      "El parámetro 'page_size' debe ser un entero entre 1 y 40.",
    );
  }

  return query;
};

const shouldRetry = (error) => {
  if (!error.response) return true;
  return error.response.status >= 500;
};

// Wrapper con reintento simple: útil para amortiguar fallos transitorios de RAWG.
const rawgGet = async (url, params, retries = 1) => {
  try {
    return await rawgClient.get(url, { params });
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      return rawgGet(url, params, retries - 1);
    }
    throw error;
  }
};

const buildRawgParams = (query = {}) => ({
  key: process.env.RAWG_API_KEY,
  ...sanitizeQueryParams(query),
});

// --- 1. FUNCIÓN ORIGINAL: OBTENER LISTA DE JUEGOS ---
export const getGames = async (req, res, next) => {
  try {
    const cacheKey = req.originalUrl;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const params = buildRawgParams(req.query);

    const response = await rawgGet("/games", params);

    cache.set(cacheKey, response.data);
    return res.json(response.data);
  } catch (error) {
    return next(createHttpError(502, "No fue posible obtener juegos en este momento."));
  }
};

// --- 2. NUEVA FUNCIÓN: OBTENER DETALLES COMBINADOS ---
export const getGameDetailsCombined = async (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(String(id))) {
    return next(createHttpError(400, "El id del juego es inválido."));
  }

  const cacheKey = `/api/games/details/${id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) return res.json(cachedData);

  try {
    const params = buildRawgParams();

    // EL BACKEND HACE EL TRABAJO SUCIO
    const [detailsRes, screenshotsRes, moviesRes] = await Promise.allSettled([
      rawgGet(`/games/${id}`, params),
      rawgGet(`/games/${id}/screenshots`, params),
      rawgGet(`/games/${id}/movies`, params),
    ]);

    if (detailsRes.status === "rejected") {
      if (detailsRes.reason?.response?.status === 404) {
        return next(createHttpError(404, "Juego no encontrado"));
      }
      return next(
        createHttpError(502, "No fue posible obtener los detalles del juego."),
      );
    }

    // Empaquetamos todo en un solo JSON
    const combinedData = {
      ...detailsRes.value.data,
      extraScreenshots:
        screenshotsRes.status === "fulfilled"
          ? screenshotsRes.value.data.results
          : [],
      extraMovies:
        moviesRes.status === "fulfilled" ? moviesRes.value.data.results : [],
    };

    cache.set(cacheKey, combinedData); // Lo guardamos en RAM del servidor
    return res.json(combinedData);
  } catch (error) {
    return next(
      createHttpError(502, "No fue posible obtener los detalles del juego."),
    );
  }
};

export const getCollection = async (req, res, next) => {
  try {
    // Extraemos la colección dinámica de la URL (ej: 'genres', 'platforms')
    const { endpoint } = req.params;

    if (!ALLOWED_COLLECTION_ENDPOINTS.has(endpoint)) {
      return next(createHttpError(400, `Colección no permitida: ${endpoint}`));
    }

    const cacheKey = req.originalUrl;
    const cachedData = cache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    const params = buildRawgParams(req.query);

    // Petición dinámica a RAWG
    const response = await rawgGet(`/${endpoint}`, params);

    cache.set(cacheKey, response.data);
    return res.json(response.data);
  } catch (error) {
    return next(
      createHttpError(
        502,
        `No fue posible obtener la colección solicitada: ${req.params.endpoint}`,
      ),
    );
  }
};
