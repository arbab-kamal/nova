"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Settings, Share2, User, File } from "lucide-react";

const MIN_SIDEBAR_WIDTH = 256;
const MAX_SIDEBAR_WIDTH = 800;

// Dummy data for files
const DUMMY_FILES = [
  "Annual Report 2024.pdf",
  "Project Proposal.pdf",
  "Meeting Notes.pdf",
  "Budget Analysis.pdf",
  "Technical Documentation.pdf",
];

const RightSidebar = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);

  // Handle mouse move event for resizing
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - event.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  // Handle mouse up event to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Drag handle */}
      <div
        className="fixed right-0 top-0 bottom-0 cursor-ew-resize bg-gray-200"
        style={{
          right: `${sidebarWidth}px`,
          width: "1px",
        }}
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 min-h-screen bg-white border-l border-gray-200 overflow-hidden flex flex-col"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Settings className="w-6 h-6 text-gray-600" />
            <div className="flex gap-4">
              <Share2 className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          <nav className="space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded cursor-pointer">
              <User className="w-5 h-5 flex-shrink-0 text-gray-600" />
              <span className="text-sm text-gray-800">Demo User</span>
            </div>

            {/* Files Section */}
            <div className="mt-6">
              <h3 className="px-4 text-xs font-medium text-gray-600 mb-2">
                Your Files
              </h3>
              <div className="space-y-1">
                {DUMMY_FILES.map((fileName, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-3 hover:bg-gray-100 text-gray-800 rounded cursor-pointer flex items-center gap-3 text-left"
                  >
                    <File className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm truncate">{fileName}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
