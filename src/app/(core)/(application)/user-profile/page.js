import UserProfileClient from "@/components/app/user/profile/UserProfileClient";
import { getAuthToken, getUserDataFromCookies } from "@/utils/auth";

// Validate token and get full user data
async function validateAndGetUserData(token) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ JWT: token }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.code === "jwt_auth_valid_token" && data.data?.user) {
      return data.data.user;
    }

    return null;
  } catch (error) {
    console.error("Error validating token:", error);
    return null;
  }
}

// Fetch user reviews from the server
async function fetchUserReviews(email, page = 1, perPage = 10) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/comments/user-comments?email=${encodeURIComponent(
        email
      )}&page=${page}&per_page=${perPage}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return {
      comments: [],
      total_comments: 0,
      current_page: 1,
      per_page: perPage,
      total_pages: 0,
      has_next_page: false,
      has_prev_page: false,
      has_comments: false,
    };
  }
}

// Fetch user's favorite therapists with pagination
async function fetchFavoriteTherapists(token, page = 1, perPage = 6) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/users/favorites-therapists?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Cookie: `authToken=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch favorite therapists:", response.status);
      return {
        therapists: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          perPage: perPage,
          total: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const data = await response.json();
    return {
      therapists: data.therapists || [],
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 0,
        perPage: perPage,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  } catch (error) {
    console.error("Error fetching favorite therapists:", error);
    return {
      therapists: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        perPage: perPage,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export default async function UserProfilePage() {
  // Get auth token from cookies
  const token = await getAuthToken();
  const cookieUserData = await getUserDataFromCookies();



  // If no token, let client component handle redirect
  if (!token) {
    return (
      <UserProfileClient
        initialData={{
          user: null,
          reviews: { items: [], pagination: {}, totalCount: 0 },
          favoriteTherapists: { items: [], pagination: {} },
        }}
      />
    );
  }

  // Validate token and get full user data
  const validatedUserData = await validateAndGetUserData(token);

  // Fetch user's ACF data including profile picture
  let profilePictureUrl = null;
  if (validatedUserData?.id || validatedUserData?.ID) {
    try {
      const userId = validatedUserData.id || validatedUserData.ID;
      const backendUrl = process.env.BACKEND_URL;
      const userAuth = process.env.USER_AUTH;
      const passwordAuth = process.env.PASSWORD_AUTH;
      const basicAuth = Buffer.from(`${userAuth}:${passwordAuth}`).toString('base64');

      const userDetailsResponse = await fetch(
        `${backendUrl}/wp-json/wp/v2/users/${userId}?context=edit`,
        {
          headers: {
            'Authorization': `Basic ${basicAuth}`
          },
          cache: 'no-store'
        }
      );

      if (userDetailsResponse.ok) {
        const userDetails = await userDetailsResponse.json();

        // Get profile picture from ACF
        profilePictureUrl = userDetails.acf?.user_profile_picture_url || null;

        // Convert WordPress URLs to proxy URLs for browser access
        if (profilePictureUrl && profilePictureUrl.includes('/wp-content/uploads/')) {
          const match = profilePictureUrl.match(/\/wp-content\/uploads\/(.+)$/);
          if (match) {
            profilePictureUrl = `/api/media/${match[1]}`;
          }
        }

        // Update validatedUserData with name from WordPress REST API
        // WordPress REST API returns 'name' field (display name), not 'display_name'
        if (userDetails.name) {
          validatedUserData.name = userDetails.name;
        }
      }
    } catch (error) {
      console.error('Error fetching user ACF data:', error);
    }
  }





  // If token is invalid, let client component handle redirect
  if (!validatedUserData) {
    return (
      <UserProfileClient
        initialData={{
          user: null,
          reviews: { items: [], pagination: {}, totalCount: 0 },
          favoriteTherapists: { items: [], pagination: {} },
        }}
      />
    );
  }

  // Prepare user data
  const userData = {
    id: validatedUserData.id || validatedUserData.ID,
    name:
      validatedUserData.name ||                           // From WordPress REST API (display_name field)
      cookieUserData?.displayName ||                      // From cookies
      validatedUserData.display_name ||                   // From JWT validation (fallback)
      validatedUserData.user_email?.split("@")[0] ||     // From email
      "User",
    email: cookieUserData?.email || validatedUserData.user_email || "",
    image: profilePictureUrl || cookieUserData?.avatar || null, // Prioritize ACF field over cookies
    joinDate: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    reviewsCount: 0, // Will be updated from reviews data
    location: "Not specified",
  };

  // Fetch user reviews
  const reviewsData = await fetchUserReviews(userData.email);

  // Update review count
  userData.reviewsCount = reviewsData.total_comments || 0;

  // Fetch favorite therapists with pagination
  const favoritesData = await fetchFavoriteTherapists(token, 1, 6);

  // Prepare initial data with everything pre-loaded
  const initialData = {
    user: userData,
    reviews: {
      items: reviewsData.comments || [],
      pagination: {
        currentPage: reviewsData.current_page || 1,
        totalPages: reviewsData.total_pages || 0,
        perPage: reviewsData.per_page || 10,
        totalComments: reviewsData.total_comments || 0,
        hasNextPage: reviewsData.has_next_page || false,
        hasPrevPage: reviewsData.has_prev_page || false,
      },
      totalCount: reviewsData.total_comments || 0,
    },
    favoriteTherapists: {
      items: favoritesData.therapists || [],
      pagination: favoritesData.pagination || {
        currentPage: 1,
        totalPages: 0,
        perPage: 6,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  };

  // Return with pre-loaded data - no loading state!
  return <UserProfileClient initialData={initialData} />;
}
