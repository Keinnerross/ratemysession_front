import { useState } from "react";

export default function UserReviewContent({ content }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 40; // Límite de palabras antes de truncar
  const words = content.split(/\s+/); // Dividir por espacios
  const needsExpand = words.length > wordLimit;

  const displayContent = isExpanded 
    ? content 
    : words.slice(0, wordLimit).join(' ') + (needsExpand ? '...' : '');

  return (
    <div className="mb-1">
      <p className="text-[13.5px] font-base text-stone-600 font-['poppins'] tracking-[0.16px] max-w-[720px] leading-6 whitespace-pre-line">
        {displayContent}
        {needsExpand && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-[13.5px] text-amethyst-500 hover:text-amethyst-700 font-['poppins'] font-medium ml-1 focus:outline-none transition-colors duration-200"
          >
            More
          </button>
        )}
          {needsExpand && isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[13.5px] text-amethyst-500 hover:text-amethyst-700 font-['poppins'] font-medium focus:outline-none transition-colors duration-200 pl-1"
        >
          Read less
        </button>
      )}
      </p>

    
    </div>
  );
}