"use client";

import React, { useState } from "react";
import TherapistCard from "@/components/app/therapists/cards/therapistCard";
import CustomSelect from "@/components/global/inputs/CustomSelect";

export default function SavedTherapistsList({ therapists = [] }) {
  const [sortBy, setSortBy] = useState("recent");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Reset loading when filters change
  React.useEffect(() => {
    setIsFilterLoading(true);

    const timer = setTimeout(() => {
      setIsFilterLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [sortBy, filterSpecialty, filterLocation]);

  // Get unique specialties and locations for filter options
  const specialties = [...new Set(therapists.map((t) => t.specialty))].sort();
  const locations = [...new Set(therapists.map((t) => t.location))].sort();

  // Apply sorting
  const sortedTherapists = [...therapists].sort((a, b) => {
    if (sortBy === "recent") {
      // Sort by saved date if available, otherwise by id
      return (b.savedDate || b.id) - (a.savedDate || a.id);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Apply filters
  const filteredTherapists = sortedTherapists.filter((therapist) => {
    const matchesSpecialty =
      filterSpecialty === "all" || therapist.specialty === filterSpecialty;
    const matchesLocation =
      filterLocation === "all" || therapist.location === filterLocation;
    return matchesSpecialty && matchesLocation;
  });
  if (therapists.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-lg text-gray-500 font-['Outfit']">
          You haven't saved any therapists yet.
        </p>
        <p className="text-sm text-gray-400 font-['Outfit'] mt-2">
          Browse and save therapists to easily find them later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filters */}

      <div className="flex items-center justify-between">
        {therapists.length > 0 && (
          <div className="flex gap-4 mb-4 md:mb-8 flex-wrap">
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "recent", label: "Recently Saved" },
                { value: "rating", label: "Highest Rating" },
                { value: "name", label: "Name (A-Z)" },
              ]}
              rounded="rounded-full"
              className="min-w-[160px]"
              defaultValue="recent"
            />

            {/* <CustomSelect
              value={filterSpecialty}
              onChange={setFilterSpecialty}
              rounded="rounded-full"
              options={[
                { value: "all", label: "All Specialties" },
                ...specialties.map((s) => ({ value: s, label: s })),
              ]}
              className="min-w-[180px]"
              defaultValue="all"
            />

            <CustomSelect
              value={filterLocation}
              onChange={setFilterLocation}
              rounded="rounded-full"
              options={[
                { value: "all", label: "All Locations" },
                ...locations.map((l) => ({ value: l, label: l })),
              ]}
              className="min-w-[160px]"
              defaultValue="all"
            /> */}
          </div>
        )}
      </div>

      {/* Therapists List */}
      <div className="flex flex-col gap-4 relative min-h-[200px]">
        {isFilterLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#7466f2]"></div>
          </div>
        ) : filteredTherapists.length > 0 ? (
          filteredTherapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              dataTherapist={{
                ...therapist,
                isSaved: true,
                onSaveToggle: (isSaved) =>
                  console.log(`Saved ${therapist.name}:`, isSaved),
                onReadReviews: (id) =>
                  console.log(`Read reviews for therapist ID:`, id),
              }}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-500 font-['Outfit']">
            No therapists found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
