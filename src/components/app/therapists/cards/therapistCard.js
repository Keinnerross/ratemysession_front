"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaStar,
  FaMapMarkerAlt,
  FaChevronRight,
  FaHeart,
} from "react-icons/fa";
import NotificationToast from "@/components/global/notifications/NotificationToast";
import ConfirmationModal from "@/components/global/modals/ConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import favoritesService from "@/services/users/favoritesService";

export default function TherapistCard({ dataTherapist = {} }) {
  const [isLocalSaved, setIsLocalSaved] = useState(
    dataTherapist.isSaved || false
  );
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  // Destructure with fallbacks
  const {
    id,
    name = "Therapist Name",
    location = "Location Not Available",
    image = null,
    thumbnail = null,
    rating = 0,
    reviews = 0,
    credentials = [],
    specialty = "General Therapist",
    priceRange = "Price not available",
    availableOnline = false,
    languages = ["English"],
    insurance = [],
    bio = "Bio not available",
    isSaved = false,
    onSaveToggle,
    onReadReviews,
  } = dataTherapist;

  const ratingPercentage = (rating / 5) * 100;


  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Si no está autenticado, redirigir al login
    if (!user) {
      router.push("/login");
      return;
    }

    // Si está guardado y se quiere quitar, mostrar confirmación
    if (isLocalSaved) {
      setShowConfirmDialog(true);
      return;
    }

    // Si no está guardado, agregarlo directamente
    await performSaveToggle();
  };

  const performSaveToggle = async () => {
    setIsLoading(true);
    try {
      const success = await favoritesService.toggleFavorite(id, isLocalSaved);
      if (success) {
        const newSavedState = !isLocalSaved;
        setIsLocalSaved(newSavedState);
        setNotificationMessage(
          newSavedState
            ? `${name} has been saved to your profile`
            : `${name} has been removed from your saved therapists`
        );
        setShowNotification(true);
        onSaveToggle && onSaveToggle(newSavedState);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setNotificationMessage("Error updating favorites. Please try again.");
      setShowNotification(true);
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Link href={`/therapist-profile?id=${id}`} className="block">
        <div className="bg-white border border-amethyst-100 rounded-xl p-3 md:p-6 cursor-default">
          <div className="flex gap-2 md:gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-amethyst-200 rounded-full overflow-hidden flex items-center justify-center">
                {(thumbnail || image) &&
                !(thumbnail || image).includes(
                  "/assets/default-therapist.jpg"
                ) ? (
                  <img
                    src={thumbnail || image}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="md:text-3xl font-medium text-amethyst-600 font-outfit">
                    {name.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1  min-w-0">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-2">
                <div className="w-full justify-between md:justify-start flex items-start gap-3 pr-2">
                  <div>
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 font-outfit">
                      {name}
                    </h3>
                    <div className="flex items-center gap-1 md:gap-2 my-1">
                      <FaMapMarkerAlt className="text-gray-400 text-sm flex-shrink-0" />
                      <span className="text-xs text-gray-500 font-poppins font-medium">
                        {location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse md:flex-row items-center gap-2 mt-0 md:mt-1">
                    <div className="w-full md:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${ratingPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium text-gray-700 font-outfit">
                        {(typeof rating === 'number' ? rating : parseFloat(rating) || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  {/* Save Button */}
                  <button
                    onClick={handleSaveToggle}
                    disabled={isLoading}
                    className="p-1 md:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    <FaHeart
                      className={`w-3 h-3 md:w-4 md:h-4 transition-all ${
                        isLocalSaved
                          ? "text-amethyst-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Specialty */}
              <div className="mb-1 md:mb-2">
                <span className="px-3 py-1 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md font-outfit">
                  {specialty}
                </span>
              </div>
            </div>
          </div>
          {/* Bottom Row */}
          <div className="flex items-center gap-2 pt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amethyst-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-medium text-white font-poppins">
                  {reviews > 999 ? "1k+" : reviews > 99 ? "99+" : reviews}
                </span>
              </div>
              <span className=" font-medium text-gray-700 font-outfit">
                Ratings received
              </span>
            </div>

            <span>-</span>

            {/* Read Reviews Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Allow the Link to handle navigation
              }}
              className="flex items-center gap-1 text-amethyst-500 hover:text-amethyst-600 transition-colors font-outfit  font-medium"
            >
              Read Reviews
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </Link>

      {/* Notification Toast */}
      <NotificationToast
        message={notificationMessage}
        subtitle=""
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        type="success"
      />

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={performSaveToggle}
        title="Remove from favorites?"
        message={`Are you sure you want to remove ${name} from your favorites list?`}
        confirmText="Yes, remove"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  );
}
