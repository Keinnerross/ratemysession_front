'use client';

import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";


export const SearchbarWithFilters = () => {
  const [focusedField, setFocusedField] = useState(null);

  return (
    <div className="flex items-center w-full max-w-5xl py-1 bg-white rounded-full border-1 border-amethyst-100 pr-2 ">




      {/* Search Section */}
      <div className={`flex-1 flex flex-col justify-center px-6 h-full  group ${focusedField === 'therapist' ? ' rounded-l-full' : ''
        }`}
        onClick={() => setFocusedField('therapist')}
      >
        <label className="font-semibold text-gray-700 text-xs  mb-0.5 transition-colors group-hover:text-amethyst-600">
          Therapist
        </label>
        <input
          type="text"
          placeholder="Find therapist reviews"
          className="w-full text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent font-normal"
          onFocus={() => setFocusedField('therapist')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200" />

      {/* Zip Code Section */}
      <div
        className={`flex flex-col justify-center px-6 h-full w-[180px] group ${focusedField === 'zipcode' ? '' : ''
          }`}
        onClick={() => setFocusedField('zipcode')}
      >
        <label className="font-semibold text-gray-700 text-xs mb-0.5 transition-colors group-hover:text-amethyst-600">
          Zip Code
        </label>
        <input
          type="text"
          placeholder="Enter zip code"
          className="w-full text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent font-normal"
          onFocus={() => setFocusedField('zipcode')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200" />

      {/* City Section */}
      <div
        className={`flex flex-col justify-center px-6 h-full w-[160px] group ${focusedField === 'city' ? '' : ''
          }`}
        onClick={() => setFocusedField('city')}
      >
        <label className="font-semibold text-gray-700 text-xs   mb-0.5 transition-colors group-hover:text-amethyst-600">
          City
        </label>
        <input
          type="text"
          placeholder="Enter city"
          className="w-full text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent font-normal"
          onFocus={() => setFocusedField('city')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Divider */}


      {/* Categories Section */}
      {/* <div 
        className={`flex flex-col justify-center px-6 h-full min-w-[190px] group ${
          focusedField === 'categories' ? '' : ''
        }`}
        onClick={() => setFocusedField('categories')}
      >
        <label className="font-semibold text-gray-700 text-xs  mb-0.5 transition-colors group-hover:text-amethyst-600">
          Categories
        </label>
        <select 
          className="w-full text-sm text-gray-800 outline-none bg-transparent font-normal cursor-pointer appearance-none pr-8"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
          onFocus={() => setFocusedField('categories')}
          onBlur={() => setFocusedField(null)}
        >
          <option value="all">All Categories</option>
          <option value="mental-health">Mental Health</option>
          <option value="physical-therapy">Physical Therapy</option>
          <option value="occupational">Occupational Therapy</option>
        </select>
      </div> */}



      {/* Search Button */}
      <div className="cursor-pointer flex items-center justify-center w-14 h-14 bg-amethyst-500 rounded-full 
      hover:bg-amethyst-600 transition-all duration-200 shadow-md hover:shadow-lg group">
          <IoSearchOutline fill="white" size={26} className="text-white cursor-pointer" />

      </div>
    </div>
  );
};