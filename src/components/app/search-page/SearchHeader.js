import React from 'react';
import ActiveFilters from './ActiveFilters';

const SearchHeader = ({ resultCount, filters, onFilterChange, onClearAll }) => {
  return (
    <div className="flex-1 pt-10">
      <div>
        <h2 className="text-2xl font-outfit font-semibold text-gray-900">
          Showing Results: {resultCount}
        </h2>

        <div className="flex flex-col gap-4 mt-4 mb-6">
          <ActiveFilters 
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;