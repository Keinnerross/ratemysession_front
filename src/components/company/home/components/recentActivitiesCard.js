import { ReactionBar } from './reactionBar';

export function RecentActivityCard({ review }) {
    // Default values if review prop is not provided
    const defaultReview = {
        authorName: "Sherry W.",
        timeAgo: "1 week ago",
        therapistName: "Jessica Miller",
        rating: 4.0,
        content: "Jessica was incredibly supportive and patient throughout my sessions. She helped me see...",
        authorImage: null,
        likes: 1,
        comments: 0,
        shares: 0
    };

    const data = review || defaultReview;

    // Helper function to render star rating
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => {
            const filled = index < Math.floor(rating);
            const halfFilled = index < rating && index >= Math.floor(rating);

            return (
                <svg
                    key={index}
                    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        });
    };

    return (
        <div className="w-full bg-white rounded-xl border border-amethyst-100 max-w-[350px] transform hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="px-4 pt-4 pb-16 relative">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amethyst-200 flex items-center justify-center text-amethyst-700 font-semibold text-sm">
                        {data.authorImage ? (
                            <img
                                src={data.authorImage}
                                alt={data.authorName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            data.authorName.charAt(0)
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-light text-gray-900">
                            {data.authorName} wrote a review
                        </p>
                        <p className="text-sm text-gray-500">{data.timeAgo}</p>
                    </div>
                </div>

                <hr className="border-gray-100 mb-3" />

                {/* Content */}
                <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">{data.therapistName}</h3>

                    <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(data.rating)}</div>
                        <span className="text-gray-600 text-xs">{data.rating.toFixed(1)}</span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                        {data.content}
                    </p>

                    <button className="text-amethyst-600 hover:text-amethyst-700 text-sm font-medium transition-colors">
                        Read More
                    </button>
                </div>

                <hr className="border-gray-100 my-3" />

                {/* Reactions */}
                <div className='w-full absolute bottom-5 left-0 px-4 '>
                    <ReactionBar />
                </div>
            </div>
        </div>
    );
}