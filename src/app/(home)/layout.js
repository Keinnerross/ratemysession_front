"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HeaderHome } from "@/components/layout/header/headerHome";
import { Footer } from "@/components/layout/footer/footer";
import { AddTherapistProvider, useAddTherapist } from "@/context/AddTherapistContext";
import AddTherapistWizard from "@/components/app/therapists/forms/AddTherapistWizard";
import { therapistService } from "@/services/therapists/therapistService";

function LayoutContent({ children }) {
  const { isAddTherapistOpen, closeAddTherapist, openAddTherapist } = useAddTherapist();
  const searchParams = useSearchParams();
  const [savedDraft, setSavedDraft] = useState(null);
  
  useEffect(() => {
    // Check if returning from registration with therapist draft
    if (searchParams.get('openTherapist') === 'true') {
      const draft = therapistService.getTherapistDraft();
      if (draft) {
        setSavedDraft(draft);
        openAddTherapist();
        
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('openTherapist');
        window.history.replaceState({}, '', url);
      }
    }
  }, [searchParams, openAddTherapist]);
  
  const handleClose = () => {
    setSavedDraft(null);
    closeAddTherapist();
  };
  
  return (
    <>
      <HeaderHome />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      
      {/* Global Add Therapist Modal */}
      <AddTherapistWizard 
        isOpen={isAddTherapistOpen}
        onClose={handleClose}
        savedDraft={savedDraft}
      />
    </>
  );
}

export default function LayoutHome({ children }) {
  return (
    <AddTherapistProvider>
      <Suspense fallback={null}>
        <LayoutContent>{children}</LayoutContent>
      </Suspense>
    </AddTherapistProvider>
  );
}