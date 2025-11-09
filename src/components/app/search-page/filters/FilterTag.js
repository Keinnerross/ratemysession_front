
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const FilterTag = ({ label, onRemove, removable = true }) => {
  return (
    <div className="flex-shrink-0 px-3 py-1 bg-amethyst-50 text-amethyst-500 rounded-full text-sm font-poppins flex items-center gap-2">

      {label}
      {removable && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity flex-shrink-0">
          <FaTimes className="text-xs hover:text-amethyst-900" />
        </button>
      )}
    </div>
  );
};

export default FilterTag;