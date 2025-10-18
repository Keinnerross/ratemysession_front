"use client";

import React, { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </div>
  );
}