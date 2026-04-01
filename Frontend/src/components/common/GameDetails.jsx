import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Star,
  Monitor,
  Users,
  Loader2,
  Play,
  ShoppingCart,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Tag,
} from "lucide-react";
import clsx from "clsx";

// 🚀 IMPORTACIONES CENTRALIZADAS
import { getPlatformIcon } from "../../utils/platformIcons";
import { getStoreIcon } from "../../utils/storeIcons";
import { useGameDetails } from "../../hooks/useGamesData";
import { getResponsiveSrcSet } from "../../utils/imageCrop";
import ReviewsSection from "./reviews/ReviewsSection";

// ASSETS IMPORTS
import BrushPink from "../../assets/images/brush_royal_pink.webp";
import PinkPaint from "../../assets/images/pink_paint.webp";

// --- FONDO MURAL OPTIMIZADO PARA DETALLES ---
const DetailsBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute top-0 right-0 w-[50%] h-[50%] object-cover opacity-[0.03] rotate-90"
    />
  </div>
);

// --- COMPONENTE CARRUSEL LIGERO ---
const ScreenshotsCarousel = ({ screenshots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!screenshots || screenshots.length === 0) return null;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative mt-8 group">
      <h4 className="font-marker text-xl md:text-2xl text-white mb-4">
        GALERÍA
      </h4>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-800 shadow-[4px_4px_0_#000] md:shadow-[8px_8px_0_#000]">
        <img
          src={screenshots[currentIndex].image}
          alt="Screenshot"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/60 hover:bg-jinx-pink text-white border-2 border-transparent hover:border-black rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity will-change-opacity"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/60 hover:bg-jinx-pink text-white border-2 border-transparent hover:border-black rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity will-change-opacity"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
        {screenshots.map((shot, idx) => (
          <button
            key={shot.id}
            onClick={() => setCurrentIndex(idx)}
            className={`shrink-0 w-20 md:w-24 aspect-video rounded border-2 transition-colors ${currentIndex === idx ? "border-jinx-pink" : "border-gray-800 hover:border-gray-600"}`}
          >
            <img
              src={shot.image}
              alt={`Miniatura ${idx + 1}`}
              width={68}
              height={46}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- HELPER SINOPSIS ---
const extractPreferredLanguage = (htmlString) => {
  if (!htmlString) return "Sin descripción disponible.";
  const spanishRegex =
    /(?:<[^>]+>)*\s*(?:Español|Spanish|Idioma Español)\s*[:-]?\s*(?:<[^>]+>)*/i;
  const otherLanguagesRegex =
    /(?:<[^>]+>)*\s*(?:English|Русский|Deutsch|Français|Italiano|Português|Polski|日本語|中文)\s*[:-]?\s*(?:<[^>]+>)*/i;

  if (spanishRegex.test(htmlString)) {
    let parts = htmlString.split(spanishRegex);
    let textAfterSpanish = parts[parts.length - 1];
    let finalSpanishText = textAfterSpanish.split(otherLanguagesRegex)[0];
    return finalSpanishText.trim() || htmlString;
  }

  let cleanedText = htmlString.split(otherLanguagesRegex)[0];
  if (cleanedText.trim().length < 50) return htmlString;
  return cleanedText.trim();
};

const Synopsis = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = content.length > 500;

  return (
    <section>
      <div className="relative mb-6">
        <img
          src={BrushPink}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute -top-4 -left-6 w-24 md:w-32 opacity-20 -rotate-6 pointer-events-none"
        />
        <h3 className="font-marker text-2xl md:text-3xl text-jinx-pink relative z-10">
          SINOPSIS
        </h3>
      </div>
      <div className="relative">
        <div
          className={clsx(
            "prose prose-invert prose-base md:prose-lg max-w-none font-roboto text-gray-300 leading-relaxed transition-all duration-300",
            !isExpanded &&
              isLong &&
              "max-h-48 overflow-hidden mask-image-gradient-to-b",
          )}
          style={{
            WebkitMaskImage:
              !isExpanded && isLong
                ? "linear-gradient(to bottom, black 50%, transparent 100%)"
                : "none",
            maskImage:
              !isExpanded && isLong
                ? "linear-gradient(to bottom, black 50%, transparent 100%)"
                : "none",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center justify-center md:justify-start w-full md:w-auto gap-2 text-zaun-green hover:text-white font-bold tracking-widest transition-colors focus:outline-none py-2"
          >
            {isExpanded ? (
              <>
                LEER MENOS <ChevronUp size={20} />
              </>
            ) : (
              <>
                LEER MÁS <ChevronDown size={20} />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
};

const GameDetails = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: game, isLoading, isError } = useGameDetails(id);

  const pcRequirements = useMemo(() => {
    if (!game) return null;
    const pcPlatform = game.platforms?.find((p) => p.platform.slug === "pc");
    return pcPlatform?.requirements_en || pcPlatform?.requirements_ru || null;
  }, [game]);

  const cleanDescription = useMemo(() => {
    if (!game) return "";
    return extractPreferredLanguage(game.description);
  }, [game]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-jinx-pink">
        <Loader2 className="animate-spin w-16 h-16 mb-4" />
        <p className="font-marker text-2xl animate-pulse text-white">
          EXTRAYENDO DATOS...
        </p>
      </div>
    );
  }

  if (isError || !game) return null;

  const mainTrailer =
    game.extraMovies && game.extraMovies.length > 0
      ? game.extraMovies[0].data.max
      : null;

  return (
    <section className="relative w-full min-h-screen pt-8 md:pt-12 pb-20 px-4 md:px-8 text-white overflow-x-hidden">
      <DetailsBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 mb-6 md:mb-8 text-gray-400 hover:text-jinx-pink font-bold tracking-widest transition-colors w-fit text-xs md:text-sm"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          REGRESAR AL INICIO
        </Link>

        {/* HERO SECTION */}
        <div className="relative w-full h-62.5 md:h-125 rounded-2xl overflow-hidden border-2 md:border-4 border-gray-800 shadow-[6px_6px_0_#000] md:shadow-[12px_12px_0_#000] mb-8 md:mb-12 flex items-end bg-black">
          {/* 🚀 CORRECCIÓN DE BARRAS NEGRAS: Volvemos a object-cover en móvil, combinándolo con object-center para que se llene toda la caja */}
          <img
            src={game.background_image}
            srcSet={
              game.background_image
                ? getResponsiveSrcSet(game.background_image)
                : undefined
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1366px) 1280px, 100vw"
            alt={game.name}
            loading="eager"
            decoding="sync"
            className="absolute inset-0 w-full h-full object-cover object-center md:object-top transform-gpu opacity-70"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-900/60 to-transparent" />

          <div className="relative p-4 md:p-12 w-full z-10">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
              {game.playtime > 0 && (
                <span className="px-2 md:px-3 py-1 bg-zaun-green text-black font-bold text-[10px] md:text-sm border-2 border-black shadow-[2px_2px_0_#000]">
                  {game.playtime} HORAS APROX.
                </span>
              )}
              {game.rating > 0 && (
                <div className="flex items-center gap-1 bg-gray-900 px-2 md:px-3 py-1 border-2 border-gray-700 shadow-[2px_2px_0_#000] text-[10px] md:text-sm">
                  <Star
                    size={12}
                    className="text-zaun-green fill-zaun-green md:w-4 md:h-4"
                  />
                  <span className="font-bold">{game.rating} / 5</span>
                </div>
              )}
            </div>
            <h1 className="font-marker text-4xl sm:text-5xl md:text-7xl text-white drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000] leading-none text-balance">
              {game.name}
            </h1>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL - GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-10 md:space-y-12">
            <Synopsis content={cleanDescription} />

            {mainTrailer && (
              <section>
                <h4 className="font-marker text-xl md:text-2xl text-white mb-4 flex items-center gap-2">
                  <Play className="text-zaun-green" /> TRÁILER OFICIAL
                </h4>
                <div className="w-full aspect-video border-2 border-gray-800 shadow-[4px_4px_0_#000] md:shadow-[8px_8px_0_#000] bg-black">
                  <video
                    src={mainTrailer}
                    controls
                    className="w-full h-full object-contain"
                    poster={game.background_image}
                  ></video>
                </div>
              </section>
            )}

            <ScreenshotsCarousel screenshots={game.extraScreenshots} />

            {pcRequirements &&
              (pcRequirements.minimum || pcRequirements.recommended) && (
                <section className="bg-gray-900 border-2 border-gray-800 p-4 md:p-8 shadow-[4px_4px_0_#000] md:shadow-[8px_8px_0_#000]">
                  <h4 className="font-marker text-xl md:text-2xl text-white mb-4 md:mb-6 border-b-2 border-gray-800 pb-2 flex items-center gap-2">
                    <Cpu className="text-jinx-pink" /> REQUISITOS (PC)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-xs md:text-sm font-mono text-gray-400">
                    {pcRequirements.minimum && (
                      <div>
                        <h5 className="text-zaun-green font-bold mb-2">
                          MÍNIMOS:
                        </h5>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {pcRequirements.minimum
                            .replace("Minimum:", "")
                            .trim()}
                        </div>
                      </div>
                    )}
                    {pcRequirements.recommended && (
                      <div>
                        <h5 className="text-jinx-pink font-bold mb-2">
                          RECOMENDADOS:
                        </h5>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {pcRequirements.recommended
                            .replace("Recommended:", "")
                            .trim()}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 p-5 md:p-6 border-2 border-gray-800 shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000]">
              <h4 className="font-marker text-lg md:text-xl text-white border-b-2 border-gray-800 pb-2 mb-4">
                INFO TÉCNICA
              </h4>
              <ul className="space-y-4 font-mono text-[11px] md:text-sm">
                {/* 🚀 CORRECCIÓN: flex-col en móvil, flex-row en md. Título arriba, valor abajo en celulares. */}
                <li className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1 md:gap-2 border-b border-gray-800 pb-2">
                  <span className="text-gray-500 flex items-center gap-2 shrink-0">
                    <Calendar size={16} /> LANZAMIENTO
                  </span>
                  <span className="text-white font-bold text-left md:text-right">
                    {game.released
                      ? new Date(game.released).toLocaleDateString()
                      : "TBA"}
                  </span>
                </li>

                {/* 🚀 CORRECCIÓN APILAMIENTO: Eliminado el "truncate". En móvil se apilan hacia abajo ocupando todo el ancho. */}
                <li className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1 md:gap-4 border-b border-gray-800 pb-2">
                  <span className="text-gray-500 flex items-center gap-2 shrink-0">
                    <Users size={16} /> DESARROLLADOR
                  </span>
                  <span className="text-zaun-green font-bold text-left md:text-right wrap-break-word w-full md:w-auto">
                    {game.developers?.map((d) => d.name).join(", ") || "N/A"}
                  </span>
                </li>
              </ul>
            </div>

            {(game.genres?.length > 0 || game.tags?.length > 0) && (
              <div className="bg-gray-900 p-5 md:p-6 border-2 border-gray-800 shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000]">
                <h4 className="font-marker text-lg md:text-xl text-white border-b-2 border-gray-800 pb-2 mb-4 flex items-center gap-2">
                  <Tag size={18} className="text-jinx-pink" /> GÉNEROS Y TAGS
                </h4>

                {game.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.genres.map((g) => (
                      <Link
                        key={g.id}
                        to={`/search?genres=${g.id}`}
                        className="text-black bg-zaun-green hover:bg-white text-[10px] md:text-xs font-bold tracking-wider uppercase px-2 md:px-3 py-1.5 border-2 border-black transition-colors shadow-[2px_2px_0_#000]"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}

                {game.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {game.tags
                      .filter((t) => t.language === "eng")
                      .slice(0, 6)
                      .map((t) => (
                        <span
                          key={t.id}
                          className="text-gray-400 bg-black text-[9px] md:text-[10px] font-mono tracking-wider uppercase px-2 py-1 border border-gray-800 select-none"
                        >
                          #{t.name}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-900 p-5 md:p-6 border-2 border-gray-800 shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000]">
              <h4 className="font-marker text-lg md:text-xl text-white border-b-2 border-gray-800 pb-2 mb-4 flex items-center gap-2">
                <Monitor size={18} className="text-jinx-pink" /> PLATAFORMAS
              </h4>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map((p) => (
                  <span
                    key={p.platform.id}
                    className="text-gray-300 text-xs md:text-sm flex items-center gap-2 bg-black px-2 md:px-3 py-1.5 md:py-2 border border-gray-800"
                  >
                    {getPlatformIcon(p.platform.slug, 16)} {p.platform.name}
                  </span>
                ))}
              </div>
            </div>

            {game.stores && game.stores.length > 0 && (
              <div className="bg-gray-900 p-5 md:p-6 border-2 border-gray-800 shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000]">
                <h4 className="font-marker text-lg md:text-xl text-white border-b-2 border-gray-800 pb-2 mb-4 flex items-center gap-2">
                  <ShoppingCart size={18} className="text-zaun-green" /> DÓNDE
                  COMPRAR
                </h4>
                <div className="flex flex-col gap-2 md:gap-3">
                  {game.stores.map((s) => (
                    <a
                      key={s.store.id}
                      href={`https://${s.store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 bg-black border border-gray-700 hover:border-zaun-green text-gray-300 hover:text-white transition-colors group"
                    >
                      <span className="flex items-center gap-3 text-xs md:text-sm">
                        <span className="text-lg md:text-xl group-hover:text-zaun-green transition-colors">
                          {getStoreIcon(s.store.slug)}
                        </span>
                        <span className="font-bold">{s.store.name}</span>
                      </span>
                      <ArrowLeft className="rotate-135 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity w-4 h-4 text-zaun-green" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ReviewsSection gameId={id} gameName={game.name} />
      </div>
    </section>
  );
};

export default GameDetails;
