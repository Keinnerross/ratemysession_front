'use client';

import { ButtonCustom } from "@/components/global/buttons/buttons";
import { RecentActivityCard } from "./components/recentActivitiesCard";
import { useRef, useState } from "react";
import { useScrollAppear } from "@/utils/scrollAppear";

export function RecentActivitiesSection() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useScrollAppear(
        sectionRef,
        () => setIsVisible(true),
        () => setIsVisible(false),
        0.3,
        100
    );
    const recentReviews = [
        {
            authorName: "Sherry W.",
            timeAgo: "1 week ago",
            therapistName: "Jessica Miller",
            rating: 4.0,
            content: "Jessica was incredibly supportive and patient throughout my sessions. She helped me see things from a new perspective.",
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
        <section 
            ref={sectionRef}
            className="pb-26 pt-16 transition-all duration-700"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
            }}
        >
            <div className="container relative mx-auto max-w-[1330px] ">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl  font-medium text-gray-900 mb-4">
                        Recent Activities
                    </h2>

                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center w-full">
                    {recentReviews.map((review, index) => (
                        <RecentActivityCard key={index} review={review} />
                    ))}
                </div>

                {/* View More Button */}
                <div className=" flex justify-center z-10 relative">
                    <ButtonCustom variant={1}>View More Reviews</ButtonCustom>
                </div>


                <div className="absolute bottom-0 w-full h-[600px] bg-gradient-to-t from-white from-18%  to-transparent" />

            </div>
        </section>
    );
}