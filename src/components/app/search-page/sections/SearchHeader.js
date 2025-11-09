import React from 'react';
import ActiveFilters from '../filters/ActiveFilters';
import CustomSelect from '@/components/global/inputs/CustomSelect';
import { FaFilter } from 'react-icons/fa';

const SearchHeader = ({ resultCount, filters, onFilterChange, onClearAll, onOpenFilters, sortBy, onSortChange }) => {
  return (
    <div className="flex-1 pt-6 lg:pt-10">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-outfit font-semibold text-gray-900">
            Showing Results: {resultCount}
          </h2>
          
          {/* Mobile Filter Button */}
          <button
            onClick={onOpenFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-amethyst-500 hover:bg-amethyst-600 text-white rounded-full transition-colors"
          >
            <FaFilter className="text-sm" />
            <span className="font-poppins font-medium text-sm">Filters</span>
          </button>
        </div>

        <div className="flex lg:flex-row lg:items-center justify-between gap-4 mt-4 mb-6">
          <ActiveFilters 
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
          />
          
          {/* Sort Selector */}
          <div className="flex justify-end">
            <CustomSelect
              value={sortBy}
              onChange={onSortChange}
              options={[
                { value: "recommended", label: "Recommended" },
                { value: "alphabetical-asc", label: "Alphabetical A-Z" },
                { value: "alphabetical-desc", label: "Alphabetical Z-A" },
              ]}
              rounded="rounded-full"
              className="min-w-[160px] lg:min-w-[180px] flex-nowrap whitespace-nowrap"
              defaultValue="recommended"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;