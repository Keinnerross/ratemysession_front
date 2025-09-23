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
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-4">
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

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-amethyst-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">{data.likes}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-600 hover:text-amethyst-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">{data.comments}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-600 hover:text-amethyst-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.684C18.114 16.062 18 16.518 18 17c0 .482.114.938.316 1.342m0-2.684a3 3 0 110 2.684M9.316 16.658C9.114 16.062 9 15.518 9 15c0-.482.114-.938.316-1.342M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{data.shares}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}