import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MessageSquareText, Star } from "lucide-react";

const ratings = [1, 2, 3, 4, 5];

const ReviewForm = ({
  initialValues,
  onSubmit,
  isLoading,
  onCancelEdit,
  isEditing,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      rating: initialValues?.rating || 5,
      comment: initialValues?.comment || "",
    },
  });

  const selectedRating = Number(watch("rating", initialValues?.rating || 5));

  useEffect(() => {
    reset({
      rating: initialValues?.rating || 5,
      comment: initialValues?.comment || "",
    });
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="bg-gray-900/85 border-2 border-gray-800 p-4 md:p-6 shadow-[4px_4px_0_#000]"
    >
      <h4 className="font-marker text-xl text-white mb-4 flex items-center gap-2">
        <MessageSquareText className="text-jinx-pink" />
        {isEditing ? "EDITAR RESEÑA" : "ESCRIBIR RESEÑA"}
      </h4>

      <div className="mb-4">
        <span className="block text-xs font-bold tracking-widest text-gray-300 mb-2">
          PUNTUACIÓN
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="cursor-pointer inline-flex items-center gap-1"
            >
              <input
                type="radio"
                value={rating}
                className="sr-only"
                {...register("rating", {
                  required: "Selecciona una puntuación",
                  min: { value: 1, message: "Mínimo 1 estrella" },
                  max: { value: 5, message: "Máximo 5 estrellas" },
                })}
              />
              <Star
                className={`w-6 h-6 transition-colors ${rating <= selectedRating ? "text-zaun-green fill-zaun-green" : "text-gray-500"}`}
              />
            </label>
          ))}
          <span className="text-sm text-dirty-white ml-2">{selectedRating}/5</span>
        </div>
        <p
          className={`text-jinx-pink text-xs mt-1 min-h-4 ${errors.rating ? "visible" : "invisible"}`}
        >
          {errors.rating?.message || " "}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold tracking-widest text-gray-300 mb-2">
          COMENTARIO
        </label>
        <textarea
          rows={5}
          className="w-full bg-black/50 border-2 border-gray-700 focus:border-jinx-pink text-dirty-white p-3 outline-none resize-y"
          placeholder="Comparte tu opinión del juego: jugabilidad, historia, rendimiento, etc."
          {...register("comment", {
            required: "El comentario es obligatorio",
            minLength: {
              value: 20,
              message: "Escribe al menos 20 caracteres",
            },
            maxLength: {
              value: 1200,
              message: "Máximo 1200 caracteres",
            },
          })}
        />
        <p
          className={`text-jinx-pink text-xs mt-1 min-h-4 ${errors.comment ? "visible" : "invisible"}`}
        >
          {errors.comment?.message || " "}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-jinx-pink border-2 border-black text-white font-black tracking-wider hover:bg-zaun-green hover:text-black transition-colors disabled:opacity-60"
        >
          {isLoading ? "GUARDANDO..." : isEditing ? "ACTUALIZAR RESEÑA" : "PUBLICAR RESEÑA"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 bg-black border-2 border-gray-700 text-gray-200 font-bold tracking-wider hover:border-jinx-pink transition-colors"
          >
            CANCELAR EDICIÓN
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
