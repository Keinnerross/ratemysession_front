"use client";

import React, { useMemo } from "react";
import FilterTag from "./FilterTag";

const ActiveFilters = ({ filters, onFilterChange, onClearAll }) => {
  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.rating) count++;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.location) count++;
    if (filters.searchTerm) count++;
    if (filters.showFavorites) count++;
    return count;
  }, [filters]);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-wrap gap-3">
        {/* All Categories - Always first when no categories selected */}
        {filters.categories.length === 0 && (
          <FilterTag label="All Categories" removable={false} />
        )}

        {/* Search Term */}
        {filters.searchTerm && (
          <FilterTag
            label={`Search: ${filters.searchTerm}`}
            onRemove={() => onFilterChange({ ...filters, searchTerm: "" })}
          />
        )}

        {/* Rating */}
        {filters.rating && (
          <FilterTag
            label={`${filters.rating} Stars`}
            onRemove={() => onFilterChange({ ...filters, rating: null })}
          />
        )}

        {/* Selected Categories */}
        {filters.categories.map((category) => (
          <FilterTag
            key={category}
            label={category}
            onRemove={() =>
              onFilterChange({
                ...filters,
                categories: filters.categories.filter((c) => c !== category),
              })
            }
          />
        ))}

        {/* Location */}
        {filters.location && (
          <FilterTag
            label={filters.location}
            onRemove={() => onFilterChange({ ...filters, location: "" })}
          />
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="h-full hidden md:flex items-center ">
          <button
            onClick={onClearAll}
            className="text-sm text-amethyst-500 hover:text-amethyst-600 font-poppins font-medium whitespace-nowrap"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;
