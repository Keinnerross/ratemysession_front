import { therapists } from "@/data/therapists";
import TherapistProfileContent from "@/components/app/therapist-profile/TherapistProfileContent";

export default async function TherapistProfilePage({ searchParams }) {
  const params = await searchParams;
  const therapistId = params?.id ? parseInt(params.id) : null;
  
  // Find therapist by ID
  const therapist = therapistId ? therapists.find(t => t.id === therapistId) : null;
  
  // If no therapist found, you could redirect or show a not found message
  if (!therapist && therapistId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600 font-outfit">Therapist not found</p>
      </div>
    );
  }
  
  return <TherapistProfileContent data={therapist || {}} />;
}