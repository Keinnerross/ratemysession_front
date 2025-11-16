import { therapists as mockTherapists } from "@/data/therapists";
import TherapistProfileContent from "@/components/app/therapists/profile/TherapistProfileContent";
import { therapistService } from "@/services/therapists/therapistService";
import { commentService } from "@/services/comments/commentService";
import { transformTherapistData } from "@/utils/therapistTransformer";
import { loadMoreReviews } from "./actions";
import { getAuthToken, getUserIdFromToken } from '@/utils/auth';

export default async function TherapistProfilePage({ searchParams }) {
  const params = await searchParams;
  const therapistId = params?.id ? parseInt(params.id) : null;
  
  // Try to get therapist and initial reviews from API
  let therapist = null;
  let initialReviewsData = { reviews: [], hasMore: false, totalCount: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  let isSaved = false;

  // Get user ID if logged in (for reaction state)
  const userId = await getUserIdFromToken();

  try {
    if (therapistId) {
      const [apiTherapist, commentCounts] = await Promise.all([
        therapistService.getTherapistById(therapistId),
        commentService.getCommentCountsForPosts([therapistId])
      ]);

      if (apiTherapist) {
        const transformedData = transformTherapistData([apiTherapist], commentCounts, userId);
        therapist = transformedData[0] || null;
      }

      // Get initial page of reviews with userId for reaction state
      initialReviewsData = await loadMoreReviews(therapistId, 1, 'recent', 'all', userId);
      
      // Check if therapist is saved by current user
      const token = await getAuthToken();
      if (token && therapistId) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
          const response = await fetch(`${baseUrl}/api/users/favorites`, {
            headers: {
              'Cookie': `authToken=${token}`,
            },
            cache: 'no-store'
          });
          
          if (response.ok) {
            const data = await response.json();
            const favoriteIds = data.favorites || [];
            isSaved = favoriteIds.includes(therapistId);
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch therapist from API:', error);
    // Fallback to mock data
    therapist = therapistId ? mockTherapists.find(t => t.id === therapistId) : null;
    
    // Still check if saved even with mock data
    const token = await getAuthToken();
    if (token && therapistId) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/users/favorites`, {
          headers: {
            'Cookie': `authToken=${token}`,
          },
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          const favoriteIds = data.favorites || [];
          isSaved = favoriteIds.includes(therapistId);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
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
    isSaved={isSaved}
  />;
}