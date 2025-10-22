'use client';

import React, { useState } from 'react';
import { FaStar, FaChevronDown, FaChevronUp, FaFilter, FaMapMarkerAlt, FaHeart, FaCheck } from 'react-icons/fa';
import { HiOutlineViewGrid } from 'react-icons/hi';

const FilterSidebar = ({ filters = {}, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    stars: true,
    categories: true,
    location: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleRatingChange = (rating) => {
    onFilterChange?.({
      ...filters,
      rating: filters.rating === rating ? null : rating
    });
  };

  const handleCategoryChange = (category) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    onFilterChange?.({
      ...filters,
      categories: newCategories
    });
  };

  const categories = [
    'Family Therapist',
    'Psychiatrist',
    'Clinical Psychologist',
    'Couples Therapist',
    'Child Psychologist'
  ];

  return (
    <div className="w-full bg-white border-r border-amethyst-100 overflow-hidden">
      <div className="p-6 space-y-6 mt-6">
        {/* Stars Section */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('stars')}
            className="flex items-center justify-between w-full mb-4"
          >
            <div className="flex items-center gap-2">
              <FaStar className="text-amethyst-500" />
              <h3 className="font-poppins font-semibold text-gray-900">Stars</h3>
            </div>
            {expandedSections.stars ? 
              <FaChevronUp className="text-gray-500 text-xs" /> : 
              <FaChevronDown className="text-gray-500 text-xs" />
            }
          </button>
          
          {expandedSections.stars && (
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 transition-colors ${
                      filters.rating === rating 
                        ? 'bg-amethyst-500 border-amethyst-500' 
                        : 'border-amethyst-300 group-hover:border-amethyst-400'
                    }`}>
                      {filters.rating === rating && (
                        <FaCheck className="text-white text-xs absolute top-0.5 left-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-[2px]">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-poppins text-sm text-gray-700">
                    {rating} Star{rating !== 1 ? 's' : ''}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full mb-4"
          >
            <div className="flex items-center gap-2">
              <HiOutlineViewGrid className="text-amethyst-500" />
              <h3 className="font-poppins font-semibold text-gray-900">Categories</h3>
            </div>
            {expandedSections.categories ? 
              <FaChevronUp className="text-gray-500 text-xs" /> : 
              <FaChevronDown className="text-gray-500 text-xs" />
            }
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={!filters.categories || filters.categories.length === 0}
                    onChange={() => onFilterChange?.({ ...filters, categories: [] })}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 transition-colors ${
                    (!filters.categories || filters.categories.length === 0)
                      ? 'bg-amethyst-500 border-amethyst-500' 
                      : 'border-amethyst-300 group-hover:border-amethyst-400'
                  }`}>
                    {(!filters.categories || filters.categories.length === 0) && (
                      <FaCheck className="text-white text-xs absolute top-0.5 left-0.5" />
                    )}
                  </div>
                </div>
                <span className="font-poppins text-sm text-gray-700">All</span>
              </label>
              
              <div className="mt-4">
                <p className="font-poppins text-xs font-semibold text-gray-500 uppercase mb-2">Popular</p>
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group mb-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={filters.categories?.includes(category) || false}
                        onChange={() => handleCategoryChange(category)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 transition-colors ${
                        filters.categories?.includes(category)
                          ? 'bg-amethyst-500 border-amethyst-500' 
                          : 'border-amethyst-300 group-hover:border-amethyst-400'
                      }`}>
                        {filters.categories?.includes(category) && (
                          <FaCheck className="text-white text-xs absolute top-0.5 left-0.5" />
                        )}
                      </div>
                    </div>
                    <span className="font-poppins text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
              
              <button className="text-amethyst-500 font-poppins text-sm hover:text-amethyst-600 transition-colors mt-2">
                View All Categories
              </button>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="pb-6">
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full mb-4"
          >
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-amethyst-500" />
              <h3 className="font-poppins font-semibold text-gray-900">Location</h3>
            </div>
            {expandedSections.location ? 
              <FaChevronUp className="text-gray-500 text-xs" /> : 
              <FaChevronDown className="text-gray-500 text-xs" />
            }
          </button>
          
          {expandedSections.location && (
            <div className="space-y-3">
              <div className="relative">
                <label className="absolute -top-2 left-2 px-1 bg-white text-xs font-poppins font-semibold text-gray-600">
                  Location
                </label>
                <select 
                  value={filters.location || ""}
                  onChange={(e) => onFilterChange?.({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-amethyst-300 rounded-md font-poppins text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amethyst-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Miami">Miami</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My Favorites Section */}
      <div className="border-t border-gray-200 px-6 py-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <FaStar className="text-amethyst-500 text-base" />
          <span className="font-poppins font-semibold text-gray-900">My Favorites</span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;