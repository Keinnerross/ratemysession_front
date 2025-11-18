"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePasswordForm({ onSubmit, onCancel, isLoading = false }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    onSubmit(currentPassword, newPassword);
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onCancel?.();
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      <h3 className="text-lg md:text-xl font-normal text-gray-800 font-['Outfit'] tracking-[-0.32px] mb-4 md:mb-6">
        Change Password
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-['poppins']">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-['poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#7466f2] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed pr-12"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-['poppins']">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-['poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#7466f2] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed pr-12"
              placeholder="Enter new password (min. 6 characters)"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 font-['poppins']">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-['poppins'] text-sm focus:outline-none focus:ring-2 focus:ring-[#7466f2] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed pr-12"
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 font-['poppins']">{error}</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium font-['poppins'] text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-full bg-[#7466f2] text-white font-medium font-['poppins'] text-sm hover:bg-[#6153e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
