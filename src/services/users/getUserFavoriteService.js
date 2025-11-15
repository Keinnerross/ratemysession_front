export const getUserFavoritesTherapists = async (
  userId,
  page = 1,
  perpage = 2
) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/wp-json/rms/v1/users/${userId}/favorites-therapists?page=${page}&perpage=${perpage}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.USER_AUTH}:${process.env.PASSWORD_AUTH}`
            ).toString("base64"),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data); // Por quitar
    return data;
  } catch (error) {
    console.error("Error fetching favorites therapists:", error);
    throw error;
  }
};
