"use client";

import Image from "next/image";

export function ReactionBar({
  commentId,
  reactions = {},
  userReaction = null,
  onReaction,
  disabled = false,
  useInCard = false,
}) {
  // Default reactions if not provided
  const defaultReactions = {
    useful: 0,
    helpful: 0,
    insightful: 0,
    inappropriate: 0,
  };

  const reactionData = { ...defaultReactions, ...reactions };

  // Map frontend keys to reaction types
  const reactionTypes = [
    {
      key: "useful",
      src: "/assets/icons-svg/react/Helpful.svg",
      alt: "Useful",
      label: "Useful",
    },
    {
      key: "helpful",
      src: "/assets/icons-svg/react/love.svg",
      alt: "Love",
      label: "Loved",
    },
    {
      key: "insightful",
      src: "/assets/icons-svg/react/thanks.svg",
      alt: "Thanks",
      label: "Thankful",
    },
    {
      key: "inappropriate",
      src: "/assets/icons-svg/react/oh_no.svg",
      alt: "Oh No",
      label: "Oh no!",
    },
  ];

  const handleClick = (reactionKey) => {
    if (disabled || !onReaction) return;
    onReaction(commentId, reactionKey);
  };

  return (
    <div
      className={`${
        useInCard ? "justify-start" : "justify-between "
      } w-full flex items-center gap-5`}
    >
      {reactionTypes.map((reaction) => {
        const count = reactionData[reaction.key] || 0;
        const isActive = userReaction === reaction.key;

        return (
          <button
            key={reaction.key}
            onClick={() => handleClick(reaction.key)}
            disabled={disabled}
            className={`flex items-center gap-1 p-1.5 rounded-lg transition-all ${
              isActive
                ? "bg-amethyst-50 hover:bg-amethyst-100"
                : "hover:bg-gray-100"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            aria-label={`React with ${reaction.label}`}
            title={reaction.label}
          >
            <div className={`${useInCard ? "w-5 h-5" : "w-6 h-6"}  relative`}>
              <Image
                src={reaction.src}
                alt={reaction.alt}
                fill
                className={`object-contain ${
                  isActive ? "filter-amethyst" : ""
                }`}
              />
            </div>
            {count > 0 && (
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-amethyst-600" : "text-gray-600"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
