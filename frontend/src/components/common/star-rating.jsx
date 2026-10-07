import { Star } from "lucide-react";

function StarRatingComponent({ rating = 0, handleRatingChange, size = "md" }) {
  const box = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        const icon = <Star className={`${box} ${filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />;
        return handleRatingChange ? (
          <button key={star} type="button" onClick={() => handleRatingChange(star)} aria-label={`${star} stars`} className="transition hover:scale-110">
            {icon}
          </button>
        ) : (
          <span key={star}>{icon}</span>
        );
      })}
    </div>
  );
}

export default StarRatingComponent;
