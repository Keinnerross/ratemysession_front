"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonCustom } from "@/components/global/buttons/buttons";
import FilterSidebar from "@/components/app/search-page/FilterSidebar";
import SearchHeader from "@/components/app/search-page/SearchHeader";
import TherapistList from "@/components/app/search-page/TherapistList";

export default function SearchLayout({ data, searchParams = {} }) {
  const router = useRouter();




  // Parse filters from URL params
  const filters = {
    rating: searchParams.rating ? parseInt(searchParams.rating) : null,
    categories: searchParams.categories ? searchParams.categories.split(',') : [],
    location: searchParams.location || "",
    searchTerm: searchParams.q || "",
    showFavorites: searchParams.favorites === 'true',
  };

  const [visibleCount, setVisibleCount] = useState(6); // Show 6 therapists initially

  // Update URL when filters change
  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    
    // Only add params if they have values
    if (newFilters.searchTerm) params.set('q', newFilters.searchTerm);
    if (newFilters.rating) params.set('rating', newFilters.rating.toString());
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.categories && newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','));
    }
    if (newFilters.showFavorites) params.set('favorites', 'true');
    
    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ''}`);
    setVisibleCount(6); // Reset pagination when filters change
  };

  // Data is already filtered on the server
  const filteredTherapists = data || [];

  // Get visible therapists based on pagination
  const visibleTherapists = filteredTherapists.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const clearAllFilters = () => {
    router.push('/search');
    setVisibleCount(6);
  };





  return (
    <div className="min-h-screen bg-white py-23">
      {/* Main Content Container */}
      <div className="w-full  border-t border-amethyst-100">
        <div className="max-w-[1280px] mx-auto ">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Filters */}
            <aside className="w-full lg:w-81">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </aside>
            {/* Therapist Cards Container */}
            <main className="flex-1">
              <SearchHeader 
                resultCount={filteredTherapists.length}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
              />

              <TherapistList 
                therapists={visibleTherapists}
                visibleCount={visibleCount}
                totalCount={filteredTherapists.length}
                onShowMore={handleShowMore}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
