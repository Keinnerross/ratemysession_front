'use client';

import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

export const SearchbarBasic = ({ placeholder = "Search therapist reviews", onSearch, className = "" }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex items-center w-full px-1.5 py-1.5 bg-white rounded-full border border-amethyst-100">
        
        {/* Search Input */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-1.5 text-gray-800 placeholder:text-gray-400 outline-none bg-transparent text-sm"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center w-9 h-9 bg-amethyst-500 rounded-full 
          hover:bg-amethyst-600 transition-all duration-200 shadow-sm hover:shadow-md group mr-1.5"
        >
          <IoSearchOutline size={20} className="text-white" />
        </button>
      </div>
    </form>
  );
};