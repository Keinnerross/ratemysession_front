import { RecentActivityCard } from "./components/recentActivitiesCard";

export function RecentActivitiesSection() {
    const recentReviews = [
        {
            authorName: "Sherry W.",
            timeAgo: "1 week ago",
            therapistName: "Jessica Miller",
            rating: 4.0,
            content: "Jessica was incredibly supportive and patient throughout my sessions. She helped me see things from a new perspective and gave me tools to manage my anxiety.",
            likes: 12,
            comments: 3,
            shares: 1
        },
        {
            authorName: "Michael R.",
            timeAgo: "3 days ago",
            therapistName: "Dr. Sarah Chen",
            rating: 5.0,
            content: "Dr. Chen is exceptional. Her approach is both professional and compassionate. I've made significant progress in just a few months.",
            likes: 8,
            comments: 2,
            shares: 0
        },
        {
            authorName: "Emma T.",
            timeAgo: "2 weeks ago",
            therapistName: "Robert Thompson",
            rating: 4.5,
            content: "Robert has a great way of making you feel heard and understood. His CBT techniques have been really helpful for my depression.",
            likes: 15,
            comments: 5,
            shares: 2
        },
        {
            authorName: "David L.",
            timeAgo: "5 days ago",
            therapistName: "Dr. Maria Garcia",
            rating: 3.5,
            content: "Dr. Garcia is knowledgeable but sometimes I felt our sessions were a bit rushed. Still, she provided valuable insights.",
            likes: 4,
            comments: 1,
            shares: 0
        },
        {
            authorName: "Lisa K.",
            timeAgo: "4 days ago",
            therapistName: "James Wilson, LMFT",
            rating: 5.0,
            content: "James has been instrumental in helping me work through relationship issues. His approach is warm and non-judgmental.",
            likes: 20,
            comments: 7,
            shares: 3
        },
        {
            authorName: "Chris P.",
            timeAgo: "1 day ago",
            therapistName: "Dr. Amanda Foster",
            rating: 4.5,
            content: "Dr. Foster specializes in trauma therapy and has helped me process difficult experiences with care and professionalism.",
            likes: 18,
            comments: 4,
            shares: 2
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl lg:text-5xl font-bold text-amethyst-900 mb-4">
                        Recent Activities
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        See what our community is saying about their therapy experiences
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center max-w-6xl mx-auto">
                    {recentReviews.map((review, index) => (
                        <RecentActivityCard key={index} review={review} />
                    ))}
                </div>

                {/* View More Button */}
                <div className="mt-12 text-center">
                    <button className="bg-white border-2 border-amethyst-600 text-amethyst-600 px-8 py-3 rounded-full font-medium text-lg hover:bg-amethyst-50 transition-colors">
                        View All Reviews
                    </button>
                </div>
            </div>
        </section>
    );
}