import { therapists as mockTherapists } from "@/data/therapists";
import TherapistProfileContent from "@/components/app/therapists/profile/TherapistProfileContent";
import { therapistService } from "@/services/therapists/therapistService";
import { commentService } from "@/services/comments/commentService";
import { transformTherapistData } from "@/utils/therapistTransformer";
import { loadMoreReviews } from "./actions";

export default async function TherapistProfilePage({ searchParams }) {
  const params = await searchParams;
  const therapistId = params?.id ? parseInt(params.id) : null;
  
  // Try to get therapist and initial reviews from API
  let therapist = null;
  let initialReviewsData = { reviews: [], hasMore: false, totalCount: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  
  try {
    if (therapistId) {
      const [apiTherapist, commentCounts] = await Promise.all([
        therapistService.getTherapistById(therapistId),
        commentService.getCommentCountsForPosts([therapistId])
      ]);
      
      if (apiTherapist) {
        const transformedData = transformTherapistData([apiTherapist], commentCounts);
        therapist = transformedData[0] || null;
      }
      
      // Get initial page of reviews
      initialReviewsData = await loadMoreReviews(therapistId, 1, 'recent', 'all');
    }
  } catch (error) {
    console.error('Failed to fetch therapist from API:', error);
    // Fallback to mock data
    therapist = therapistId ? mockTherapists.find(t => t.id === therapistId) : null;
  }
  
  // If no therapist found, you could redirect or show a not found message
  if (!therapist && therapistId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600 font-outfit">Therapist not found</p>
      </div>
    );
  }
  
  return <TherapistProfileContent 
    data={therapist || {}} 
    initialReviews={initialReviewsData.reviews}
    hasMoreReviews={initialReviewsData.hasMore}
    totalReviewCount={initialReviewsData.totalCount}
    initialDistribution={initialReviewsData.distribution}
  />;
}