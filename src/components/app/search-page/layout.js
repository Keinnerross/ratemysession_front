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

export default function SearchLayout({ data, searchParams = {}, availableCategories = [], availableLocations = [], hasMore = true, filteredIds = [], totalResults = 0 }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
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

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
    setCurrentPage(1); // Reset pagination when filters change
  };

  // Data is already filtered on the server
  const initialTherapists = data || [];

  // Sort therapists based on selected option
  const sortedTherapists = sortTherapists(initialTherapists, sortBy);

  // Handler for loading more therapists
  const handleLoadMore = useCallback(async () => {
    const nextPage = currentPage + 1;
    const result = await loadMoreTherapists(nextPage, filteredIds);
    setCurrentPage(nextPage);
    return result;
  }, [currentPage, filteredIds]);

  const clearAllFilters = () => {
    router.push("/search");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
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
                onSortChange={setSortBy}
              />
              <TherapistList
                key={`${filters.searchTerm}-${filters.rating}-${filters.location}-${filters.categories.join(',')}`}
                initialTherapists={sortedTherapists}
                onLoadMore={handleLoadMore}
                initialHasMore={hasMore}
                sortBy={sortBy}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
