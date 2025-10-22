import React from "react";

export default function FormField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  required = false,
  optional = false,
  rows,
  options = [],
  className = ""
}) {
  const baseInputClass = "w-full pb-2 border-b border-[#e0e5eb] outline-none focus:border-[#796bf5] transition-colors bg-transparent font-['poppins'] text-gray-900";

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} resize-none`}
          placeholder={placeholder}
          rows={rows || 2}
        />
      );
    } else if (type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} cursor-pointer`}
        >
          <option value="" className="text-[#a7a7a7]">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
          placeholder={placeholder}
        />
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="flex items-center gap-1 text-sm text-[#888787] font-['poppins'] mb-2">
        {label}
        {required && <span className="text-[#796bf5]">*</span>}
        {optional && <span className="text-sm text-gray-500">(optional)</span>}
      </label>
      {renderInput()}
    </div>
  );
}