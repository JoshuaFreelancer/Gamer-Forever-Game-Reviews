import { Star, Pencil, Trash2 } from "lucide-react";

const ReviewCard = ({ review, isOwner, onEdit, onDelete, isDeleting }) => {
  const dateLabel = review.updatedAt
    ? new Date(review.updatedAt).toLocaleDateString("es-ES")
    : "Ahora";

  return (
    <article className="bg-gray-900 border-2 border-gray-800 p-4 md:p-5 shadow-[4px_4px_0_#000]">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h5 className="font-bold text-white text-sm md:text-base">
            {review.authorName || "Jugador"}
          </h5>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider">
            {dateLabel}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 bg-black border border-gray-700 px-2 py-1">
          <Star className="w-4 h-4 text-zaun-green fill-zaun-green" />
          <span className="text-sm text-dirty-white font-bold">{review.rating}/5</span>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {review.comment}
      </p>

      {isOwner && (
        <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(review)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black border border-gray-700 text-gray-200 text-xs font-bold tracking-wider hover:border-jinx-pink transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> EDITAR
          </button>
          <button
            type="button"
            onClick={() => onDelete(review)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black border border-gray-700 text-gray-200 text-xs font-bold tracking-wider hover:border-jinx-pink transition-colors disabled:opacity-60"
          >
            <Trash2 className="w-3.5 h-3.5" /> {isDeleting ? "ELIMINANDO..." : "ELIMINAR"}
          </button>
        </div>
      )}
    </article>
  );
};

export default ReviewCard;
