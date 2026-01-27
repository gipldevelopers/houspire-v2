"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MobileUploadInterface from "@/components/mobile-upload/MobileUploadInterface";
import api from "@/lib/axios";

export default function MobileUploadPageWrapper() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const projectId = searchParams.get("projectId");
  const [isValid, setIsValid] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/mobile-upload/verify-qr/${token}`);
        const data = response.data;

        if (data.success) {
          setIsValid(true);
          setProject(data.data.project);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying QR code...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid QR Code</h1>
          <p className="text-gray-600 mb-4">
            This QR code is invalid or has expired. Please generate a new one from your computer.
          </p>
          <button
            onClick={() => window.close()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return <MobileUploadInterface token={token} project={project} />;
}
