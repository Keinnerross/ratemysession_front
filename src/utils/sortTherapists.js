export const sortTherapists = (therapists, sortBy) => {
  return [...therapists].sort((a, b) => {
    if (sortBy === "recommended") {
      // Ordenar por rating (mayor primero), luego por cantidad de reviews
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.reviews - a.reviews;
    } else if (sortBy === "alphabetical-asc") {
      // Ordenar alfabéticamente A-Z
      return a.name.localeCompare(b.name);
    } else if (sortBy === "alphabetical-desc") {
      // Ordenar alfabéticamente Z-A
      return b.name.localeCompare(a.name);
    }
    return 0;
  });
};