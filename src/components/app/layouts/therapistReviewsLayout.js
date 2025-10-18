"use client";

import React, { useState } from "react";
import { FaFilter, FaSort, FaChevronDown } from "react-icons/fa";

export default function TherapistReviewsLayout({ 
  children,
  totalReviews = 0,
  onFilterChange,
  onSortChange 
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    rating: 'all',
    period: 'all',
    verified: false
  });
  const [selectedSort, setSelectedSort] = useState('newest');

  const filterOptions = {
    rating: [
      { value: 'all', label: 'All Ratings' },
      { value: '5', label: '5 Stars' },
      { value: '4', label: '4 Stars & up' },
      { value: '3', label: '3 Stars & up' }
    ],
    period: [
      { value: 'all', label: 'All Time' },
      { value: 'week', label: 'Past Week' },
      { value: 'month', label: 'Past Month' },
      { value: 'year', label: 'Past Year' }
    ]
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    setIsSortOpen(false);
    if (onSortChange) onSortChange(sortValue);
  };

  return (
    <div className="w-full max-w-[922px] mx-auto">
      {/* Header Section */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[32px] font-medium text-[#313131] font-['Outfit'] tracking-[-0.32px]">
            Reviews
          </h2>
          
          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-4">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="text-sm text-gray-600" />
                <span className="text-sm font-['Outfit']">Filter</span>
                <FaChevronDown className={`text-xs text-gray-600 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-4">
                    {/* Rating Filter */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 font-['Outfit'] mb-2">Rating</h4>
                      {filterOptions.rating.map(option => (
                        <label key={option.value} className="flex items-center mb-2 cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            value={option.value}
                            checked={selectedFilters.rating === option.value}
                            onChange={() => handleFilterChange('rating', option.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600 font-['Outfit']">{option.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Period Filter */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 font-['Outfit'] mb-2">Time Period</h4>
                      {filterOptions.period.map(option => (
                        <label key={option.value} className="flex items-center mb-2 cursor-pointer">
                          <input
                            type="radio"
                            name="period"
                            value={option.value}
                            checked={selectedFilters.period === option.value}
                            onChange={() => handleFilterChange('period', option.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600 font-['Outfit']">{option.label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Verified Reviews Only */}
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.verified}
                        onChange={(e) => handleFilterChange('verified', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600 font-['Outfit']">Verified Reviews Only</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaSort className="text-sm text-gray-600" />
                <span className="text-sm font-['Outfit']">
                  {sortOptions.find(opt => opt.value === selectedSort)?.label || 'Sort'}
                </span>
                <FaChevronDown className={`text-xs text-gray-600 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Dropdown */}
              {isSortOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full px-4 py-2 text-left text-sm font-['Outfit'] hover:bg-gray-50 transition-colors ${
                          selectedSort === option.value ? 'bg-[#f3f1ff] text-[#7466f2]' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Underline */}
        <div className="relative h-px bg-gray-300 w-full">
          <div className="absolute left-0 top-0 w-[145px] h-1 bg-[#7466f2]" />
        </div>
      </div>

      {/* Reviews Info */}
      {totalReviews > 0 && (
        <div className="mb-6 text-sm text-gray-600 font-['Outfit']">
          Showing {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          {selectedFilters.rating !== 'all' && ` " ${selectedFilters.rating} stars`}
          {selectedFilters.period !== 'all' && ` " ${filterOptions.period.find(p => p.value === selectedFilters.period)?.label}`}
          {selectedFilters.verified && ' " Verified only'}
        </div>
      )}

      {/* Reviews Container */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}