import UserProfileContent from "@/components/app/user/profile/UserProfileContent";
import { therapists } from "@/data/therapists";
import commentsData from "@/data/comments";

export default async function UserProfilePage() {
  // Static user data for now
  const userData = {
    id: 206,
    name: "Sarah Andersen",
    email: "sandersen94@gmail.com",
    image: null,
    joinDate: "02/12/2025",
    reviewsCount: 5,
    location: "New York, NY",
  };

  // Get user reviews from comments data
  // For this example, we'll use userId 206 (Laura Sánchez) and add some others
  // Include some anonymous reviews
  const userReviews = commentsData
    .filter(comment => 
      comment.userId === 206 || 
      comment.userId === 209 || 
      comment.userId === 204 ||
      comment.userId === 202 || // Anonymous review
      comment.userId === 208  // Anonymous review
    )
    .map(review => {
      // Map therapist IDs to actual therapists (for demo purposes)
      const therapistMapping = {
        101: therapists[0], // Kwashee Totimeh
        102: therapists[1], // Aaron Rodwin
        103: therapists[2], // Adrienne Gorman
        104: therapists[3], // Alexandra Kadish
        105: therapists[4], // Alexis Carmody
      };
      
      const therapist = therapistMapping[review.therapistId] || {
        name: "Unknown Therapist",
        image: null
      };
      
      return {
        ...review,
        therapistName: therapist.name,
        therapistImage: therapist.image,
        status: review.id % 3 === 0 ? 'pending' : 'completed', // For demo, some reviews are pending
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

  // Mock saved therapists data
  const savedTherapists = [
    therapists[0], // Kwashee Totimeh
    therapists[1], // Aaron Rodwin
    therapists[4], // Alexis Carmody
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