"use client";
import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

interface WelcomeUserProps {
  className?: string;
}

const WelcomeUser: React.FC<WelcomeUserProps> = ({ className = "" }) => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/userName", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUsername("");
        } else {
          throw new Error(`Failed to fetch username: ${response.statusText}`);
        }
      } else {
        const data = await response.text();
        setUsername(data);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching username";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-4 rounded-lg bg-gray-100 ${className}`}>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-gray-100 ${className}`}>
        <p className="text-sm text-red-400">
          Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg bg-gray-100 ${className}`}>
      {username ? (
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-gray-700" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back, {username}!
            </h2>
            <p className="text-sm text-gray-600">
              We&apos;re glad to see you again.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-gray-700" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome, Guest!
            </h2>
            <p className="text-sm text-gray-600">
              Please log in to access all features.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeUser;
