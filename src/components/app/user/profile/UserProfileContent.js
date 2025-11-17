"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaCamera,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import UserReviewsList from "../reviews/UserReviewsList";
import PhotoPreviewModal from "./PhotoPreviewModal";
import ChangePasswordForm from "./ChangePasswordForm";
import NotificationToast from "../../../global/notifications/NotificationToast";
import userService from "@/services/users/userService";

export default function UserProfileContent({
  data = {},
  userReviews = [],
  savedTherapists = [],
  reviewsLoading = false,
  reviewsPagination = null,
  onReviewsFilterChange = () => {},
  onLoadMore = () => {},
  onReviewUpdate = () => {},
  onReviewDelete = () => {},
  onUserDataUpdate = () => {},
  favoritesLoading = false,
  favoritesPagination = null,
  onFavoritesFilterChange = () => {},
  onFavoritesLoadMore = () => {},
  initialTotalReviews = 0,
  initialTotalFavorites = 0,
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPhotoNotification, setShowPhotoNotification] = useState(false);
  const [showNameNotification, setShowNameNotification] = useState(false);
  const fileInputRef = useRef(null);

  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Destructure with fallback values
  const {
    id,
    name = "User Name",
    email = "user@email.com",
    image = null,
    joinDate = "01/01/2024",
    reviewsCount = 0,
    location = "Location Not Available",
    bio = "Tell us about yourself...",
    loginMethod = null,
  } = data;

  // Determine if user logged in with Google (infer from email or loginMethod field)
  const isGoogleLogin = loginMethod === 'google' || (user?.avatar && user.avatar.includes('googleusercontent.com'));

  // Handle name edit
  const handleStartEditName = () => {
    setEditedName(name);
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setEditedName("");
    setIsEditingName(false);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) return;

    setIsSavingName(true);
    try {
      await userService.updateProfile({ displayName: editedName.trim() });

      // Update local data
      onUserDataUpdate({ ...data, name: editedName.trim() });

      // Update localStorage
      if (typeof window !== 'undefined') {
        let userData;
        try {
          const stored = localStorage.getItem('user');
          // Check if it's already a JSON object or just a string (email)
          userData = stored && stored.startsWith('{')
            ? JSON.parse(stored)
            : { email: stored };
        } catch (e) {
          userData = {};
        }
        userData.displayName = editedName.trim();
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setIsEditingName(false);
      setEditedName("");

      // Show success notification
      setShowNameNotification(true);
    } catch (error) {
      console.error('Error saving name:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setIsSavingName(false);
    }
  };

  // Handle photo upload
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewPhotoUrl(previewUrl);
    setSelectedPhotoFile(file);
    setShowPhotoPreview(true);
  };

  const handlePhotoUploadConfirm = async () => {
    if (!selectedPhotoFile) return;

    setIsUploadingPhoto(true);
    try {
      const response = await userService.uploadProfilePhoto(selectedPhotoFile);

      // Update local data with new photo URL
      onUserDataUpdate({ ...data, image: response.imageUrl });

      // Update localStorage
      if (typeof window !== 'undefined') {
        let userData;
        try {
          const stored = localStorage.getItem('user');
          // Check if it's already a JSON object or just a string (email)
          userData = stored && stored.startsWith('{')
            ? JSON.parse(stored)
            : { email: stored };
        } catch (e) {
          userData = {};
        }
        userData.avatar = response.imageUrl;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userPicture', response.imageUrl);
      }

      setShowPhotoPreview(false);
      setPreviewPhotoUrl(null);
      setSelectedPhotoFile(null);

      // Show success notification
      setShowPhotoNotification(true);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(error.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handlePhotoUploadCancel = () => {
    if (previewPhotoUrl) {
      URL.revokeObjectURL(previewPhotoUrl);
    }
    setShowPhotoPreview(false);
    setPreviewPhotoUrl(null);
    setSelectedPhotoFile(null);
  };

  // Handle password change
  const handlePasswordChange = async (currentPassword, newPassword) => {
    setIsChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess(false);

    try {
      await userService.changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setPasswordError("");

      // Hide form after 2 seconds
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password. Please check your current password and try again.');
      setPasswordSuccess(false);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-12 lg:pb-16 pt-20 md:pt-28 ">
      <div className="max-w-[1140px] mx-auto px-6 md:px-6 lg:px-8 mt-6 md:mt-0">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-16">
          {/* Left Column - User Info */}
          <div className="w-full lg:w-[370px] flex flex-col items-center lg:items-start lg:sticky lg:top-24 lg:h-fit">
            {/* Profile Picture with Upload */}
            <div
              className="w-[200px] md:w-[240px] lg:w-full lg:max-w-[280px] aspect-square rounded-full bg-gray-300 overflow-hidden relative group cursor-pointer"
              onClick={handlePhotoClick}
              key={image}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.error('Image failed to load:', image);
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    className="w-full h-full bg-[#eae7ff] flex items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    <span className="text-[120px] md:text-[160px] lg:text-[220px] font-medium text-[#b6aeff] font-['Outfit'] tracking-[-2.20px]">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-[#eae7ff] flex items-center justify-center">
                  <span className="text-[120px] md:text-[160px] lg:text-[220px] font-medium text-[#b6aeff] font-['Outfit'] tracking-[-2.20px]">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Hover overlay with camera icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <FaCamera className="text-white text-4xl md:text-5xl" />
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            <div className="md:hidden block w-full mt-2">
              <div className="flex  flex-col items-center justify-center">
                {/* Header Info */}
                <div className="flex flex-col items-center gap-2 ">
                  <div className="relative flex justify-center w-fit max-w-[78vw]">
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="text-2xl font-medium text-font font-['Outfit'] text-center border-b-2 border-[#7466f2] focus:outline-none bg-transparent px-2"
                          autoFocus
                          disabled={isSavingName}
                        />
                        <button
                          onClick={handleSaveName}
                          disabled={isSavingName}
                          className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                        >
                          {isSavingName ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <FaCheck className="w-3 h-3 text-white" />
                          )}
                        </button>
                        <button
                          onClick={handleCancelEditName}
                          disabled={isSavingName}
                          className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-2xl font-medium text-font font-['Outfit'] text-center ">
                          {name}
                        </h1>
                        {/* Edit Button */}
                        <button
                          className="w-6 h-6  bg-amethyst-200 rounded-full flex items-center justify-center hover:bg-amethyst-300 transition-colors flex-shrink-0 absolute left-[104%] top-1"
                          onClick={handleStartEditName}
                        >
                          <FaEdit className="w-3 h-3 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Email and Password */}
                <div className="flex flex-col gap-1 mt-3 md:mt-4">
                  <div className="text-base  font-['poppins'] tracking-[-0.20px]">
                    <span className="font-medium text-[#7466f2]">Email: </span>
                    <span className="font-base text-gray-800 text-sm  break-all">
                      {email}
                    </span>
                  </div>
               
                </div>

                {/* Log Out Button - Desktop Position */}
                <div className=":block mt-3">
                  <button
                    onClick={handleLogout}
                    className="inline-block px-6 py-1 bg-amethyst-500 rounded-full text-white text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-6 md:mt-8 flex flex-col gap-4 md:gap-6 w-full md:max-w-[280px] lg:max-w-full">
              {/* About Title */}
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg text-[#585656] font-['poppins'] whitespace-nowrap">
                  About account
                </h3>
                <div className="flex-1 h-px bg-[#e0e5eb]"></div>
              </div>

              {/* Account Details */}
              <div className="flex flex-col gap-2 md:gap-2.5 md:pl-2">
                <p className="text-[15px] md:text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">My reviews:</span>
                  <span className="font-light"> {initialTotalReviews}</span>
                </p>
                <p className="text-[15px] md:text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">Therapists Saved:</span>
                  <span className="font-light"> {initialTotalFavorites}</span>
                </p>
                <p className="text-[15px] md:text-[17px] text-[#535252] font-['Outfit']">
                  <span className="font-medium">Register Since:</span>
                  <span className="font-light"> {joinDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="w-full flex flex-col">
            {/* User Info */}
            <div className="hidden md:block w-full">
              <div className="flex justify-between items-start gap-4">
                {/* User Details */}
                <div className="w-full flex flex-col gap-3 md:gap-4">
                  {/* Header Info */}
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                      {isEditingName ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="text-xl sm:text-2xl font-medium text-black font-['Outfit'] tracking-tight border-b-2 border-[#7466f2] focus:outline-none bg-transparent px-2"
                            autoFocus
                            disabled={isSavingName}
                          />
                          <button
                            onClick={handleSaveName}
                            disabled={isSavingName}
                            className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                          >
                            {isSavingName ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            ) : (
                              <FaCheck className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <button
                            onClick={handleCancelEditName}
                            disabled={isSavingName}
                            className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <FaTimes className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <h1 className="text-xl sm:text-2xl font-medium text-black font-['Outfit'] tracking-tight">
                          {name}
                        </h1>
                      )}

                      {/* Log Out Button - Mobile Position */}
                      <div className="sm:hidden">
                        <button
                          onClick={handleLogout}
                          className="inline-block px-4 py-1 bg-amethyst-500 rounded-full text-white text-sm font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>

                    {/* Email and Password */}
                    <div className="flex flex-col gap-1 mt-3 md:mt-4">
                      <div className="text-sm sm:text-base font-['poppins'] tracking-[-0.20px]">
                        <span className="font-medium text-[#7466f2]">
                          Email:{" "}
                        </span>
                        <span className="font-base text-gray-800 text-xs sm:text-sm break-all">
                          {email}
                        </span>
                      </div>
                     
                    </div>
                  </div>

                  {/* Log Out Button - Desktop Position */}
                  <div className="hidden sm:block flex gap-3">
                    <button
                      onClick={handleLogout}
                      className="inline-block px-6 py-1 bg-amethyst-500 rounded-full text-white text-base font-['Outfit'] hover:bg-[#6153e0] transition-colors"
                    >
                      Log Out
                    </button>

                    {/* Change Password Button - Only for traditional login */}
                    {!isGoogleLogin && (
                      <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="inline-block px-6 py-1 bg-gray-200 rounded-full text-gray-800 text-base font-['Outfit'] hover:bg-gray-300 transition-colors"
                      >
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    )}
                  </div>

                  {/* Change Password Form */}
                  {!isGoogleLogin && showPasswordForm && (
                    <div className="mt-6">
                      {passwordSuccess && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 font-['poppins'] text-sm">
                            Password changed successfully!
                          </p>
                        </div>
                      )}
                      {passwordError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800 font-['poppins'] text-sm">
                            {passwordError}
                          </p>
                        </div>
                      )}
                      <ChangePasswordForm
                        onSubmit={handlePasswordChange}
                        isLoading={isChangingPassword}
                      />
                    </div>
                  )}
                </div>

                {/* Edit Name Button */}
                {!isEditingName && (
                  <button
                    onClick={handleStartEditName}
                    className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] bg-[#cbc5ff] rounded-full flex items-center justify-center hover:bg-[#b6aeff] transition-colors flex-shrink-0"
                  >
                    <FaEdit className="w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-2 md:mt-10 lg:mt-12">
              <UserReviewsList
                reviews={userReviews}
                savedTherapists={savedTherapists}
                reviewsLoading={reviewsLoading}
                reviewsPagination={reviewsPagination}
                onFilterChange={onReviewsFilterChange}
                onLoadMore={onLoadMore}
                onReviewUpdate={onReviewUpdate}
                onReviewDelete={onReviewDelete}
                favoritesLoading={favoritesLoading}
                favoritesPagination={favoritesPagination}
                onFavoritesFilterChange={onFavoritesFilterChange}
                onFavoritesLoadMore={onFavoritesLoadMore}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      <PhotoPreviewModal
        isOpen={showPhotoPreview}
        onClose={handlePhotoUploadCancel}
        onConfirm={handlePhotoUploadConfirm}
        imageUrl={previewPhotoUrl}
        isLoading={isUploadingPhoto}
      />

      {/* Photo Upload Success Notification */}
      <NotificationToast
        message="Profile picture updated successfully!"
        subtitle="Your new photo is now visible"
        isVisible={showPhotoNotification}
        onClose={() => setShowPhotoNotification(false)}
        type="success"
        duration={3000}
      />

      {/* Name Update Success Notification */}
      <NotificationToast
        message="Name updated successfully!"
        subtitle="Your profile has been updated"
        isVisible={showNameNotification}
        onClose={() => setShowNameNotification(false)}
        type="success"
        duration={3000}
      />
    </div>
  );
}
