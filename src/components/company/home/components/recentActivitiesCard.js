"use client";

import { useRouter } from "next/navigation";
import { ReactionBar } from "./reactionBar";
import { formatTimeAgo } from "@/utils/timeAgo";

export function RecentActivityCard({ review, onReaction }) {
  const router = useRouter();

  // Default values if review prop is not provided
  const defaultReview = {
    authorName: "Anonymous",
    date: new Date().toISOString(),
    therapist: {
      name: "Therapist Name",
      id: null,
    },
    rating: 0,
    content: "Review content...",
    authorAvatar: null,
    isAnonymous: false,
    reactions: {
      useful: 0,
      helpful: 0,
      insightful: 0,
      inappropriate: 0,
    },
  };

  const data = review || defaultReview;

  // Helper function to render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);

      return (
        <svg
          key={index}
          className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    });
  };

  // Truncate content if too long
  const truncateContent = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Handle "Read More" click - navigate to therapist profile
  const handleReadMore = (e) => {
    e.stopPropagation();
    if (data.therapist?.id) {
      router.push(`/therapist-profile?id=${data.therapist.id}`);
    }
  };

  // Get author initial for avatar fallback
  const getAuthorInitial = () => {
    if (!data.authorName) return "A";
    return data.authorName.charAt(0).toUpperCase();
  };

  // Format time ago
  const timeAgo = formatTimeAgo(data.date);

  return (
    <div className="w-full bg-white rounded-xl border border-amethyst-100 max-w-[350px] transform hover:scale-[1.02] transition-transform cursor-pointer">
      <div className="px-4 pt-4 pb-16 relative">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amethyst-200 flex items-center justify-center text-amethyst-700 font-semibold text-sm flex-shrink-0">
            {data.authorAvatar ? (
              <img
                src={data.authorAvatar}
                alt={data.authorName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getAuthorInitial()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-light text-gray-900 truncate">
              {data.isAnonymous ? "Anonymous" : data.authorName} wrote a review
            </p>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>

        <hr className="border-gray-100 mb-3" />

        {/* Content */}
        <div className="">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {data.therapist?.name || "Therapist"}
          </h3>
          {/* Stars */}
          <div className="flex items-center gap-1 pb-2 pt-1">
            <div className="flex ">{renderStars(data.rating || 0)}</div>
            <span className="text-gray-600 text-sm">
              {(data.rating || 0).toFixed(1)}
            </span>
          </div>
          {/* Content */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateContent(data.content)}
          </p>

          <button
            onClick={handleReadMore}
            className="text-amethyst-600 hover:text-amethyst-700 text-sm font-medium transition-colors pt-2"
          >
            Read More
          </button>
        </div>

        <hr className="border-gray-100 my-3" />

        {/* Reactions */}
        <div className="w-full absolute bottom-5 left-0 px-4">
          <ReactionBar
            commentId={data.id}
            reactions={data.reactions}
            userReaction={data.userReaction}
            onReaction={onReaction}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
