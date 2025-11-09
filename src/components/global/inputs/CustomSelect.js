"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  rounded = "rounded-md",
  defaultValue = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Check if current value is different from default
  const hasActiveValue = defaultValue !== null && value !== defaultValue;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
    w-full py-2 px-5 gap-2 flex items-center flex-shrink-0 
    border ${
      hasActiveValue
        ? "border-[#7466f2] bg-[#f8f7ff]"
        : "border-gray-300 bg-white"
    }
    text-[#313131] text-sm font-['Poppins'] 
    ${rounded} 
    focus:outline-none focus:border-[#7466f2] 
    transition-all duration-200
    ${isOpen ? "border-[#7466f2]" : ""}
    ${className}
  `}
      >
        <span
          className={`block truncate text-left flex-1 ${
            hasActiveValue ? "text-[#7466f2] font-medium" : ""
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IoIosArrowDown
          className={`
      flex-shrink-0 
      ${hasActiveValue ? "text-[#7466f2]" : "text-[#313131]"} text-sm 
      transition-transform duration-200
      ${isOpen ? "rotate-180" : ""}
    `}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`
        absolute z-50 w-full mt-1
        bg-white border border-gray-200 
        rounded-md shadow-lg
        transition-all duration-200 origin-top
        ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
        }
      `}
      >
        <div className="py-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-5 py-2 text-left text-sm
                transition-colors duration-150 
                ${
                  value === option.value
                    ? "bg-[#f3f1ff] text-[#7466f2] font-medium"
                    : "text-[#313131] hover:bg-gray-50"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
