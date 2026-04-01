import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import routes from "./routes/index.js";

const app = express();

// Importante en despliegues detrás de proxy (Render, Vercel, Nginx).
app.set("trust proxy", 1);

// 🚀 Lista estricta de dominios permitidos leídos del .env
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PREVIEW,
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_PROD_ALT,
].filter(Boolean);

// --- Middlewares ---
app.use(helmet());

// Generamos un identificador por request para facilitar trazabilidad en logs.
app.use((req, res, next) => {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

// Limitador general para evitar abuso básico de la API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes. Intenta nuevamente en unos minutos.",
  },
});

// Limitador más estricto para rutas costosas contra RAWG.
const gamesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Límite temporal alcanzado para consulta de juegos. Intenta luego.",
  },
});

// 🛡️ CORS a prueba de balas (Nivel Producción)
app.use(
  cors({
    origin: function (origin, callback) {
      // 1) Permitir herramientas sin origin (Postman, curl, healthchecks internos)
      if (!origin) return callback(null, true);

      // 2) Validar origen contra lista explícita del entorno.
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // 3) Registrar origen bloqueado ayuda a depurar errores de despliegue.
        console.error(`🚨 CORS bloqueó la petición desde: ${origin}`);
        callback(new Error("Acceso denegado por CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Importante si en el futuro manejas cookies o sesiones
  }),
);

// Añadimos request-id a logs para correlacionar errores entre cliente y servidor.
morgan.token("request-id", (req) => req.requestId);
app.use(
  morgan(":method :url :status :response-time ms req_id=:request-id"),
);

app.use(express.json({ limit: "200kb" }));
app.use("/api", apiLimiter);
app.use("/api/games", gamesLimiter);

// --- Rutas ---
app.get("/", (req, res) => {
  res.json({
    message: "API Gamer Forever v2.0 - Sistemas en línea y protegidos 🟢",
  });
});

// Healthcheck simple para monitoreo externo y pruebas rápidas.
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "gamer-forever-backend" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "api", version: "2.1.0" });
});

// 👇 Magia de rutas
app.use("/api", routes);

// Handler 404 para rutas inexistentes.
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
    requestId: req.requestId,
  });
});

// Middleware global de errores para no filtrar detalles internos.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error("❌ Error interno:", {
      requestId: req.requestId,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({
    error: isServerError ? "Error interno del servidor" : err.message,
    requestId: req.requestId,
  });
});

export default app;
