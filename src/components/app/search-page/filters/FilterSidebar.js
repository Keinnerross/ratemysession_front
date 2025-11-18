"use client";

import React, { useState } from "react";
import {
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaMapMarkerAlt,
  FaHeart,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ButtonCustom } from "@/components/global/buttons/buttons";
import CustomSelect from "@/components/global/inputs/CustomSelect";

const FilterSidebar = ({
  filters = {},
  onFilterChange,
  availableCategories = [],
  availableLocations = [],
  isMobile = false,
  onClose,
  onClearAll,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    stars: true,
    categories: true,
    location: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRatingChange = (rating) => {
    onFilterChange?.({
      ...filters,
      rating: filters.rating === rating ? null : rating,
    });
  };

  const handleCategoryChange = (category) => {
    // Only allow one category selection at a time
    onFilterChange?.({
      ...filters,
      categories: category === "all" ? [] : [category],
    });
  };

  const FILTER_SECTION_STYLES = "border-b border-gray-200 py-6";

  // Use available categories from props or fallback to defaults
  const categories = availableCategories.length > 0 ? availableCategories : [
    "Family Therapist",
    "Psychiatrist", 
    "Clinical Psychologist",
    "Couples Therapist",
    "Child Psychologist",
  ];

  return (
    <div
      className={`h-full flex flex-col ${isMobile ? "rounded-lg" : "border-r border-amethyst-100"}`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-amethyst-100">
          <h2 className="text-lg font-semibold font-poppins text-gray-900 flex items-center gap-2">
            <FaFilter className="text-amethyst-500" />
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-600 text-lg" />
          </button>
        </div>
      )}

      {/* Filters Section*/}
      <div
        className={`flex-1 overflow-y-auto px-4 md:pr-4 ${
          isMobile ? "" : "mt-6 pb-28"
        }`}
      >
        {/* Stars Section */}
        <div className={FILTER_SECTION_STYLES}>
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleSection("stars")}
          >
            <div className="flex items-center gap-2">
              <FaStar className="text-amethyst-500" />
              <h3 className="font-poppins font-semibold text-gray-900">
                Stars
              </h3>
            </div>
            {expandedSections.stars ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>

          {expandedSections.stars && (
            <div className="space-y-3 mt-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 transition-colors ${
                        filters.rating === rating
                          ? "bg-amethyst-500 border-amethyst-500"
                          : "border-amethyst-300 group-hover:border-amethyst-400"
                      }`}
                    >
                      {filters.rating === rating && (
                        <FaCheck className="text-white text-xs absolute top-0.5 left-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-[2px]">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-poppins text-sm text-gray-700">
                    {rating} Star{rating !== 1 ? "s" : ""}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Categories Section */}
        <div className={FILTER_SECTION_STYLES}>
          <button
            onClick={() => toggleSection("categories")}
            className="flex items-center justify-between w-full "
          >
            <div className="flex items-center gap-2">
              <HiOutlineViewGrid className="text-amethyst-500" />
              <h3 className="font-poppins font-semibold text-gray-900">
                Categories
              </h3>
            </div>
            {expandedSections.categories ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>

          {expandedSections.categories && (
            <div className="space-y-3 mt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name="category"
                    checked={
                      !filters.categories || filters.categories.length === 0
                    }
                    onChange={() => handleCategoryChange("all")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      !filters.categories || filters.categories.length === 0
                        ? "bg-amethyst-500 border-amethyst-500"
                        : "border-amethyst-300 group-hover:border-amethyst-400"
                    }`}
                  >
                    {(!filters.categories ||
                      filters.categories.length === 0) && (
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1" />
                    )}
                  </div>
                </div>
                <span className="font-poppins text-sm text-gray-700">
                  All
                </span>
              </label>

              <div className="mt-4">
                <p className="font-poppins text-xs font-semibold text-gray-500 uppercase mb-2">
                  Popular
                </p>
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group mb-2"
                  >
                    <div className="relative">
                      <input
                        type="radio"
                        name="category"
                        checked={
                          filters.categories?.includes(category) || false
                        }
                        onChange={() => handleCategoryChange(category)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          filters.categories?.includes(category)
                            ? "bg-amethyst-500 border-amethyst-500"
                            : "border-amethyst-300 group-hover:border-amethyst-400"
                        }`}
                      >
                        {filters.categories?.includes(category) && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1" />
                        )}
                      </div>
                    </div>
                    <span className="font-poppins text-sm text-gray-700">
                      {category}
                    </span>
                  </label>
                ))}
              </div>

           
            </div>
          )}
        </div>
        {/* Location Section */}
        <div className={`${FILTER_SECTION_STYLES} relative ${expandedSections.location ? 'overflow-visible' : 'overflow-hidden'}`}>
          <button
            onClick={() => toggleSection("location")}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-amethyst-500" />
              <h3 className="font-poppins font-semibold text-gray-900">
                Location
              </h3>
            </div>
            {expandedSections.location ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>

          {expandedSections.location && (
            <div className="space-y-3 mt-4 relative" style={{ zIndex: 999 }}>
              <CustomSelect
                value={filters.location || ""}
                onChange={(value) =>
                  onFilterChange?.({ ...filters, location: value })
                }
                options={[
                  { value: "", label: "All Locations" },
                  ...availableLocations.map(location => ({
                    value: location,
                    label: location
                  }))
                ]}
                placeholder="Select location"
                rounded="rounded-md"
                className="w-full"
                defaultValue=""
              />
            </div>
          )}
        </div>
        {/* My Favorites Section */}
        <div className={`${FILTER_SECTION_STYLES} ${!isMobile ? 'border-b-0' : ''}`}>
          <label className="flex items-center gap-2 cursor-pointer">
            <FaStar className="text-amethyst-500 text-base" />
            <span className="font-poppins font-semibold text-gray-900">
              My Favorites
            </span>
          </label>
        </div>
      </div>

      {/* Action Buttons - Mobile Only */}
      {isMobile && (
        <div className="flex-shrink-0 border-t border-gray-200 p-4 flex flex-col items-center gap-3 bg-white rounded-b">
        
          <button
            onClick={onClearAll}
            className="text-center text-sm text-gray-600 hover:text-gray-900 transition-colors font-poppins"
          >
            Clear filters
          </button>
            <ButtonCustom variant={1} onClick={onClose}>
            View Results
          </ButtonCustom>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;