import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews, currentUid, onEdit, onDelete, isDeleting }) => {
  if (!reviews.length) {
    return (
      <div className="bg-gray-900 border-2 border-gray-800 p-4 md:p-6 text-gray-300 text-sm shadow-[4px_4px_0_#000]">
        Aún no hay reseñas para este juego. Sé la primera persona en compartir su opinión.
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          isOwner={currentUid === review.uid}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default ReviewList;
