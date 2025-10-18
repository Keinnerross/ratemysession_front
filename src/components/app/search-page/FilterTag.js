import React from 'react';
import { FaTimes } from 'react-icons/fa';

const FilterTag = ({ label, onRemove, removable = true }) => {
  return (
    <span className="px-3 py-1 bg-amethyst-100 text-amethyst-700 rounded-full text-sm font-poppins flex items-center gap-2">
      {label}
      {removable && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
          <FaTimes className="text-xs hover:text-amethyst-900" />
        </button>
      )}
    </span>
  );
};

export default FilterTag;