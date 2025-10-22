"use client";

import React, { createContext, useContext, useState } from 'react';

const AddTherapistContext = createContext();

export function AddTherapistProvider({ children }) {
  const [isAddTherapistOpen, setIsAddTherapistOpen] = useState(false);

  const openAddTherapist = () => setIsAddTherapistOpen(true);
  const closeAddTherapist = () => setIsAddTherapistOpen(false);

  return (
    <AddTherapistContext.Provider value={{ 
      isAddTherapistOpen, 
      openAddTherapist, 
      closeAddTherapist 
    }}>
      {children}
    </AddTherapistContext.Provider>
  );
}

export function useAddTherapist() {
  const context = useContext(AddTherapistContext);
  if (!context) {
    throw new Error('useAddTherapist must be used within AddTherapistProvider');
  }
  return context;
}