import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Loader2,
  MessageSquareText,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import {
  useDeleteReview,
  useGameReviews,
  useReviewsSummary,
  useUpsertReview,
} from "../../../hooks/useReviews";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewsSummary from "./ReviewsSummary";

const ReviewsSection = ({ gameId, gameName }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const filtersPanelRef = useRef(null);

  const [editingReview, setEditingReview] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [onlyMine, setOnlyMine] = useState(false);
  const [actionError, setActionError] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useGameReviews(gameId);

  const upsertMutation = useUpsertReview(gameId);
  const deleteMutation = useDeleteReview(gameId);

  const summary = useReviewsSummary(reviews);

  const currentUserReview = useMemo(() => {
    if (!user) return null;
    return reviews.find((review) => review.uid === user.uid) || null;
  }, [reviews, user]);

  const hasOwnReview = Boolean(currentUserReview);
  const isEditingOwnReview = Boolean(editingReview);
  const shouldShowReviewForm = Boolean(user) && (!hasOwnReview || isEditingOwnReview);

  // Si la carga tarda, mostramos mensaje contextual en vez de spinner "vacío".
  const isSlowLoading = isLoading;

  const filteredReviews = useMemo(() => {
    let nextReviews = [...reviews];

    if (onlyMine && user) {
      nextReviews = nextReviews.filter((review) => review.uid === user.uid);
    }

    if (ratingFilter !== "all") {
      const minRating = Number(ratingFilter);
      nextReviews = nextReviews.filter((review) => Number(review.rating) >= minRating);
    }

    if (sortBy === "rating_desc") {
      nextReviews.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === "rating_asc") {
      nextReviews.sort((a, b) => Number(a.rating) - Number(b.rating));
    } else {
      nextReviews.sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      );
    }

    return nextReviews;
  }, [reviews, onlyMine, ratingFilter, sortBy, user]);

  const activeFiltersCount =
    (sortBy !== "recent" ? 1 : 0) +
    (ratingFilter !== "all" ? 1 : 0) +
    (onlyMine ? 1 : 0);

  useEffect(() => {
    if (!isFiltersOpen) return;

    // UX: cerramos el panel si el usuario hace click fuera del contenedor.
    const handleOutsideClick = (event) => {
      if (
        filtersPanelRef.current &&
        !filtersPanelRef.current.contains(event.target)
      ) {
        setIsFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isFiltersOpen]);

  const handleSave = async (values) => {
    if (!user) return;

    try {
      setActionError("");
      await upsertMutation.mutateAsync({
        gameId,
        gameName,
        rating: values.rating,
        comment: values.comment,
        user,
      });

      setEditingReview(null);
    } catch (error) {
      setActionError(error?.message || "No se pudo guardar la reseña.");
    }
  };

  const handleDelete = async (review) => {
    if (!user) return;

    setReviewToDelete(review);
  };

  const confirmDeleteReview = async () => {
    if (!user || !reviewToDelete) return;

    try {
      setActionError("");
      await deleteMutation.mutateAsync({ gameId, uid: user.uid });

      if (editingReview?.id === reviewToDelete.id) {
        setEditingReview(null);
      }

      setReviewToDelete(null);
    } catch (error) {
      setActionError(error?.message || "No se pudo eliminar la reseña.");
      setReviewToDelete(null);
    }
  };

  return (
    <section className="mt-12 md:mt-16" id="reviews">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h3 className="font-marker text-3xl md:text-4xl text-jinx-pink inline-flex items-center gap-2">
            <MessageSquareText className="text-zaun-green" /> RESEÑAS
          </h3>
          <p className="text-gray-300 text-sm mt-2 max-w-2xl">
            Comparte tu experiencia y ayuda a otras personas a decidir si este juego vale la pena.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <ReviewsSummary count={summary.count} average={summary.average} />
        </div>
      </div>

      <div className="mb-5 md:mb-6 flex flex-wrap items-center justify-end gap-3">
        <div className="relative" ref={filtersPanelRef}>
          <button
            type="button"
            onClick={() => setIsFiltersOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-gray-700 text-dirty-white text-sm font-bold tracking-wide hover:border-jinx-pink transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-jinx-pink" />
            FILTROS
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-jinx-pink text-white text-[11px] leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {isFiltersOpen && (
            <div className="absolute right-0 mt-2 w-[min(92vw,360px)] bg-[#0b1020] border border-gray-700 shadow-[6px_6px_0_#000] p-3 md:p-4 z-40">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Ajustar filtros
                </p>
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(false)}
                  className="text-gray-400 hover:text-jinx-pink transition-colors"
                  aria-label="Cerrar filtros"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel compacto: estilo launcher sin ocupar todo el ancho */}
              <div className="space-y-3">
                <label className="block">
                  <span className="block text-[11px] uppercase tracking-widest text-gray-400 mb-1">
                    Orden
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="w-full appearance-none bg-black border border-gray-700 pl-3 pr-10 py-2 text-sm text-dirty-white outline-none focus:border-jinx-pink"
                    >
                      <option value="recent">Más recientes</option>
                      <option value="rating_desc">Mejor valoradas</option>
                      <option value="rating_asc">Peor valoradas</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </label>

                <label className="block">
                  <span className="block text-[11px] uppercase tracking-widest text-gray-400 mb-1">
                    Puntuación mínima
                  </span>
                  <div className="relative">
                    <select
                      value={ratingFilter}
                      onChange={(event) => setRatingFilter(event.target.value)}
                      className="w-full appearance-none bg-black border border-gray-700 pl-3 pr-10 py-2 text-sm text-dirty-white outline-none focus:border-jinx-pink"
                    >
                      <option value="all">Todas</option>
                      <option value="4">4+ estrellas</option>
                      <option value="3">3+ estrellas</option>
                      <option value="2">2+ estrellas</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </label>

                {user && (
                  <label className="inline-flex items-center gap-2 text-sm text-dirty-white select-none">
                    <input
                      type="checkbox"
                      checked={onlyMine}
                      onChange={(event) => setOnlyMine(event.target.checked)}
                      className="accent-jinx-pink"
                    />
                    Mostrar solo mis reseñas
                  </label>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="bg-gray-900 border-2 border-gray-800 p-4 md:p-6 text-gray-300">
          <div className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-jinx-pink" /> Cargando reseñas...
          </div>
          {isSlowLoading && (
            <p className="text-xs text-gray-400 mt-2">
              La carga puede tardar unos segundos según tu conexión.
            </p>
          )}
        </div>
      )}

      {isError && (
        <div className="bg-jinx-pink/10 border-2 border-jinx-pink p-4 text-dirty-white text-sm">
          Ocurrió un error al cargar reseñas: {error?.message || "error desconocido"}
        </div>
      )}

      {!!actionError && (
        <div className="mb-4 bg-jinx-pink/10 border-2 border-jinx-pink p-4 text-dirty-white text-sm">
          {actionError}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 md:gap-8 items-start">
          <div>
            {shouldShowReviewForm ? (
              <ReviewForm
                initialValues={editingReview}
                onSubmit={handleSave}
                isLoading={upsertMutation.isPending}
                isEditing={isEditingOwnReview}
                onCancelEdit={() => {
                  setActionError("");
                  setEditingReview(null);
                }}
              />
            ) : user ? (
              <div className="bg-gray-900 border-2 border-gray-800 p-4 md:p-6 shadow-[4px_4px_0_#000]">
                <p className="text-sm text-gray-300">
                  Ya publicaste una reseña para este juego.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActionError("");
                    setEditingReview(currentUserReview);
                  }}
                  className="mt-4 inline-flex px-4 py-2 bg-jinx-pink border-2 border-black text-white font-black tracking-widest hover:bg-zaun-green hover:text-black transition-colors"
                >
                  EDITAR MI RESEÑA
                </button>
              </div>
            ) : (
              <div className="bg-gray-900 border-2 border-gray-800 p-4 md:p-6 shadow-[4px_4px_0_#000]">
                <p className="text-sm text-gray-300">
                  Para escribir una reseña necesitas iniciar sesión.
                </p>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="mt-4 inline-flex px-4 py-2 bg-zaun-green text-black font-black tracking-widest border-2 border-black hover:bg-jinx-pink hover:text-white transition-colors"
                >
                  INICIAR SESIÓN
                </Link>
              </div>
            )}
          </div>

          <ReviewList
            reviews={filteredReviews}
            currentUid={user?.uid}
            onEdit={(review) => setEditingReview(review)}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      )}

      {!!reviewToDelete && (
        <div
          className="fixed inset-0 z-1200 bg-black/70 backdrop-blur-[2px] p-4 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-review-title"
        >
          <div className="w-full max-w-md bg-[#0b1020] border-2 border-jinx-pink shadow-[8px_8px_0_#000] p-5 md:p-6">
            <h4
              id="delete-review-title"
              className="font-marker text-2xl text-white mb-3"
            >
              Confirmar eliminación
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Esta acción eliminará tu reseña y no se puede deshacer.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 bg-black border-2 border-gray-700 text-gray-200 font-bold tracking-wider hover:border-jinx-pink transition-colors"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={confirmDeleteReview}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-jinx-pink border-2 border-black text-white font-black tracking-wider hover:bg-zaun-green hover:text-black transition-colors disabled:opacity-60"
              >
                {deleteMutation.isPending ? "ELIMINANDO..." : "SÍ, ELIMINAR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
