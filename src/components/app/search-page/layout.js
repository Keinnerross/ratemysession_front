"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ButtonCustom } from "@/components/global/buttons/buttons";
import FilterSidebar from "@/components/app/search-page/filters/FilterSidebar";
import SearchHeader from "@/components/app/search-page/sections/SearchHeader";
import TherapistList from "@/components/app/search-page/sections/TherapistList";
import { FaFilter } from "react-icons/fa";
import { loadMoreTherapists } from "@/app/(core)/(application)/search/actions";
import { sortTherapists } from "@/utils/sortTherapists";

export default function SearchLayout({ data, searchParams = {}, availableCategories = [], availableLocations = [], hasMore = true, totalResults = 0, initialFavoriteIds = [] }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.sort || "recommended");
  const [currentPage, setCurrentPage] = useState(1);

  // Parse filters from URL params
  const filters = {
    rating: searchParams.rating ? parseInt(searchParams.rating) : null,
    categories: searchParams.categories
      ? searchParams.categories.split(",")
      : [],
    location: searchParams.location || "",
    searchTerm: searchParams.q || "",
    showFavorites: searchParams.favorites === "true",
    sort: searchParams.sort || "recommended",
  };

  // Update URL when filters change
  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();

    // Only add params if they have values
    if (newFilters.searchTerm) params.set("q", newFilters.searchTerm);
    if (newFilters.rating) params.set("rating", newFilters.rating.toString());
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.categories && newFilters.categories.length > 0) {
      params.set("categories", newFilters.categories.join(","));
    }
    if (newFilters.showFavorites) params.set("favorites", "true");

    // Include current sort in URL
    const currentSort = newFilters.sort || sortBy;
    if (currentSort && currentSort !== "recommended") {
      params.set("sort", currentSort);
    }

    const queryString = params.toString();

    // Mark that we're applying filters in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('search-filter-applied', 'true');
    }

    router.push(`/search${queryString ? `?${queryString}` : ""}`);
    setCurrentPage(1); // Reset pagination when filters change
  };

  // Handle sort change
  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);

    // Update URL with new sort
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("q", filters.searchTerm);
    if (filters.rating) params.set("rating", filters.rating.toString());
    if (filters.location) params.set("location", filters.location);
    if (filters.categories.length > 0) params.set("categories", filters.categories.join(","));
    if (filters.showFavorites) params.set("favorites", "true");
    if (newSort && newSort !== "recommended") params.set("sort", newSort);

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
    setCurrentPage(1);
  }, [filters, router]);

  // Data is already filtered on the server
  const initialTherapists = data || [];

  // Sort therapists based on selected option
  const sortedTherapists = sortTherapists(initialTherapists, sortBy);

  // Handler for loading more therapists
  const handleLoadMore = useCallback(async () => {
    const nextPage = currentPage + 1;
    const result = await loadMoreTherapists(nextPage, {
      q: filters.searchTerm,
      rating: filters.rating,
      location: filters.location,
      categories: filters.categories,
      sort: sortBy
    });
    setCurrentPage(nextPage);
    return result;
  }, [currentPage, filters, sortBy]);

  const clearAllFilters = () => {
    router.push("/search");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-amethyst-50 from-[5%] to-white to-[12%] ">
      {/* Main Content Container */}
      <div className="w-full ">
        <div className="max-w-[1220px] mx-auto h-full">
          <div className="flex flex-col lg:flex-row  gap-7 h-full">
            {/* Sidebar - Filters */}
            <aside className="hidden lg:block w-full lg:w-81 lg:sticky lg:top-20 lg:h-screen ">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                availableCategories={availableCategories}
                availableLocations={availableLocations}
              />
            </aside>

            {/* Mobile Filter Modal */}
            {isSidebarOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />

                {/* Filter Modal */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden pointer-events-none">
                  <div
                    className={`bg-white rounded-lg shadow-xl w-full max-w-md h-[90vh] transform transition-all duration-300 pointer-events-auto flex flex-col ${
                      isSidebarOpen
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-0"
                    }`}
                  >
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      availableCategories={availableCategories}
                      availableLocations={availableLocations}
                      isMobile={true}
                      onClose={() => setIsSidebarOpen(false)}
                      onClearAll={clearAllFilters}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Therapist Cards Container */}
            <main className="flex-1 px-6 lg:px-0 min-h-[calc(100vh-150px)] pb-20">
              <SearchHeader
                resultCount={totalResults}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                onOpenFilters={() => setIsSidebarOpen(true)}
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
              <TherapistList
                key={`${filters.searchTerm}-${filters.rating}-${filters.location}-${filters.categories.join(',')}`}
                initialTherapists={sortedTherapists}
                onLoadMore={handleLoadMore}
                initialHasMore={hasMore}
                sortBy={sortBy}
                initialFavoriteIds={initialFavoriteIds}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
