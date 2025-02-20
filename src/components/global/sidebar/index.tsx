"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageCircle,
  Wand2,
  Clock,
  Share2,
  Bookmark,
  Archive,
  ChevronDown,
  ChevronUp,
  FolderGit2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isPromptOpen, setIsPromptOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const pathname = usePathname();

  const navItems = [
    {
      id: "project",
      icon: FolderGit2,
      label: "Project",
      href: "/chat/project",
    },
    { id: "shared", icon: Share2, label: "Shared", href: "/chat/shared" },
    {
      id: "bookmark",
      icon: Bookmark,
      label: "Bookmark",
      href: "/chat/bookmark",
    },
    { id: "archive", icon: Archive, label: "Archive", href: "/chat/archive" },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-600 to-blue-400 p-4 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-blue-600" />
        </div>
        <h1 className="text-xl font-semibold">SuperNova</h1>
      </div>

      {/* New Chat Button */}
      <Link href="/chat">
        <Button variant="secondary" className="w-full mb-6 text-blue-600">
          <MessageCircle className="w-4 h-4 mr-2" />
          Start New Chat
        </Button>
      </Link>

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Prompt Assist Section */}
        <div>
          <button className="flex items-center justify-between w-full mb-2 hover:bg-white/10 p-2 rounded-md">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <span className="font-medium">Prompt Assist</span>
            </div>
            {isPromptOpen ? (
              <ChevronDown
                className="w-4 h-4"
                onClick={() => setIsPromptOpen(!isPromptOpen)}
              />
            ) : (
              <ChevronUp
                className="w-4 h-4"
                onClick={() => setIsPromptOpen(!isPromptOpen)}
              />
            )}
          </button>

          {isPromptOpen && (
            <>
              <div className="text-xs text-white/70 mb-2 uppercase ml-6">
                SUGGESTION
              </div>

              <div className="space-y-2">
                <div className="ml-6 hover:bg-white/10 rounded-md p-2 cursor-pointer">
                  <div className="font-medium">Articles</div>
                  <div className="text-sm text-white/70">
                    Generate great article with any topics you want
                  </div>
                </div>
                <div className="ml-6 hover:bg-white/10 rounded-md p-2 cursor-pointer">
                  <div className="font-medium">Academic Writer</div>
                  <div className="text-sm text-white/70">
                    Generate song/lyrics with any genre that you love
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <Separator className="my-2 bg-white/20" />
        {/* History Section */}
        <div>
          <Link href="/chat/history" className="block">
            <button
              className={`flex items-center justify-between w-full mb-2 p-2 rounded-md 
                ${
                  pathname === "/chat/history"
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">History</span>
              </div>
              {isHistoryOpen ? (
                <ChevronDown
                  className="w-4 h-4"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                />
              ) : (
                <ChevronUp
                  className="w-4 h-4"
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                />
              )}
            </button>
          </Link>
          {isHistoryOpen && (
            <div className="space-y-2 ml-6">
              <div className="hover:bg-white/10 rounded-md p-2 cursor-pointer">
                How to Calibrate Monitor?
              </div>
              <div className="hover:bg-white/10 rounded-md p-2 cursor-pointer">
                Can you help me to create a Canva?
              </div>
            </div>
          )}
        </div>
      </div>
      <Separator className="my-2 bg-white/20" />
      {/* Bottom Navigation */}
      <div className="space-y-2 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.id} className="block">
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${
                  isActive
                    ? "bg-white/20 hover:bg-white/25"
                    : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2 text-white" />
                    <span className="text-white">{item.label}</span>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}

        <Separator className="my-2 bg-white/20" />

        <DropdownMenu>
          {/* Profile Trigger */}
          <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg cursor-pointer w-full">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">kamal@example.com</div>
              <div className="text-xs text-white/70">Free Plan</div>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </DropdownMenuTrigger>

          {/* Dropdown Menu */}
          <DropdownMenuContent className="w-48 bg-white text-gray-800 rounded-lg shadow-md mt-2">
            <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link href={"/chat/account"} className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link href={"/auth"} className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
