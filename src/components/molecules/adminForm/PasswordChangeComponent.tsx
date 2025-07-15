"use client";
import React, { useState, useEffect } from "react";
import { FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import Button from "@/components/atoms/button";
import { fetchAPI } from "@/utils/apiService";
import Alert from "@/components/atoms/alert";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface PasswordChangeResponse {
  success: boolean;
  message?: string;
}

export default function PasswordChangeComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: 'success' as 'success' | 'error' | 'warning',
    message: '',
  });

  // Clear alert after 5 seconds when shown
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasNumber && hasSpecialChar;
  };

  const validateForm = () => {
    if (!formData.oldPassword.trim()) {
      setAlert({ show: true, type: 'warning', message: 'Current password is required' });
      return false;
    }

    if (!formData.newPassword.trim()) {
      setAlert({ show: true, type: 'warning', message: 'New password is required' });
      return false;
    }

    if (!validatePasswordStrength(formData.newPassword)) {
      setAlert({ 
        show: true, 
        type: 'warning', 
        message: 'Password must be at least 6 characters with a number and special character' 
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({ show: true, type: 'warning', message: 'New password and confirm password do not match' });
      return false;
    }

    if (formData.oldPassword === formData.newPassword) {
      setAlert({ show: true, type: 'warning', message: 'New password must be different from current password' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const token = Cookies.get("token");
    if (!token) {
      setAlert({
        show: true,
        type: "error",
        message: "Session expired. Please log in again.",
      });
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchAPI<PasswordChangeResponse>({
        endpoint: "admin/change-password",
        method: "PUT",
        data: {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
      });

      if (response.success) {
        setAlert({
          show: true,
          type: "success",
          message: "Password changed successfully!",
        });

        setFormData({ 
          oldPassword: "", 
          newPassword: "", 
          confirmPassword: "" 
        });
      } else {
        setAlert({
          show: true,
          type: "error",
          message: response.message || "Failed to change password",
        });
      }
    } catch (error: any) {
      if (error.message.includes("Unauthorized") || error.message.includes("Invalid token")) {
        Cookies.remove("token");
        router.push("/login");
      }
      
      setAlert({
        show: true,
        type: "error",
        message: error.message || "An error occurred while changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (
    name: keyof typeof formData,
    label: string,
    placeholder: string,
    icon: React.ReactNode
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[name] ? "text" : "password"}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-3 pr-10 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
          disabled={loading}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => togglePasswordVisibility(name)}
          disabled={loading}
        >
          {showPasswords[name] ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-2xl mx-auto px-8 py-12">
      {alert.show && (
        <Alert
          show={alert.show}
          type={alert.type}
          message={alert.message}
          onConfirm={() => setAlert({ ...alert, show: false })}
        />
      )}

      <div className="flex items-center gap-3 mb-6">
        <FiShield className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
      </div>

      <p className="text-gray-500 text-base mb-8">
        Update your account password to keep your account secure. Make sure to use a strong password.
      </p>

      <div className="space-y-6">
        {renderPasswordField("oldPassword", "Current Password", "Enter your current password", <FiLock className="w-4 h-4" />)}
        {renderPasswordField("newPassword", "New Password", "Enter your new password", <FiLock className="w-4 h-4" />)}
        {renderPasswordField("confirmPassword", "Confirm New Password", "Confirm your new password", <FiLock className="w-4 h-4" />)}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• At least 6 characters long</li>
            <li>• Must be different from current password</li>
            <li>• Use a combination of letters, numbers, and symbols for better security</li>
          </ul>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            text={loading ? "Changing Password..." : "Change Password"}
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-lg shadow-sm text-base font-semibold bg-primary text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}