"use client";

import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";
import { AddTherapistProvider, useAddTherapist } from "@/context/AddTherapistContext";
import AddTherapistWizard from "@/components/app/therapists/forms/AddTherapistWizard";

function LayoutContent({ children }) {
  const { isAddTherapistOpen, closeAddTherapist } = useAddTherapist();
  
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      
      {/* Global Add Therapist Modal */}
      <AddTherapistWizard 
        isOpen={isAddTherapistOpen}
        onClose={closeAddTherapist}
      />
    </>
  );
}

export default function LayoutCore({ children }) {
  return (
    <AddTherapistProvider>
      <LayoutContent>{children}</LayoutContent>
    </AddTherapistProvider>
  );
}