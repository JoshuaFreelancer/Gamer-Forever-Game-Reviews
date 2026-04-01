import { MessageSquareText, Star } from "lucide-react";

const ReviewsSummary = ({ count, average }) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <div className="bg-gray-900 border-2 border-gray-800 p-3 md:p-4 shadow-[3px_3px_0_#000]">
        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">
          Reviews
        </p>
        <p className="text-xl md:text-2xl font-marker text-white inline-flex items-center gap-2">
          <MessageSquareText className="text-jinx-pink" /> {count}
        </p>
      </div>
      <div className="bg-gray-900 border-2 border-gray-800 p-3 md:p-4 shadow-[3px_3px_0_#000]">
        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">
          Promedio
        </p>
        <p className="text-xl md:text-2xl font-marker text-white inline-flex items-center gap-2">
          <Star className="text-zaun-green fill-zaun-green" /> {average.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default ReviewsSummary;
