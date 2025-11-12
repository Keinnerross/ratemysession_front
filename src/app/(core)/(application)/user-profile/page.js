"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UserProfileContent from "@/components/app/user/profile/UserProfileContent";
import { therapists } from "@/data/therapists";
import commentsData from "@/data/comments";

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    } else if (user) {
      // Set real user data
      setUserData({
        id: user.id || 206, // Use ID from backend or fallback
        name: user.displayName || user.email?.split('@')[0] || "User",
        email: user.email || "",
        image: user.avatar || null,
        joinDate: new Date().toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }),
        reviewsCount: 0, // Will be dynamic in the future
        location: "Not specified", // Can be added to user profile later
      });
    }
  }, [user, loading, router]);

  if (loading || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Get user reviews from comments data (for now using mock data)
  const userReviews = commentsData
    .filter(comment => 
      comment.userId === 206 || 
      comment.userId === 209 || 
      comment.userId === 204 ||
      comment.userId === 202 ||
      comment.userId === 208
    )
    .map(review => {
      const therapistMapping = {
        101: therapists[0],
        102: therapists[1],
        103: therapists[2],
        104: therapists[3],
        105: therapists[4],
      };
      
      const therapist = therapistMapping[review.therapistId] || {
        name: "Unknown Therapist",
        image: null
      };
      
      return {
        ...review,
        therapistName: therapist.name,
        therapistImage: therapist.image,
        status: review.id % 3 === 0 ? 'pending' : 'completed',
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Mock saved therapists data
  const savedTherapists = [
    therapists[0],
    therapists[1],
    therapists[4],
  ].map(therapist => ({
    ...therapist,
    savedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
  }));

  return <UserProfileContent 
    data={userData} 
    userReviews={userReviews} 
    savedTherapists={savedTherapists}
  />;
}