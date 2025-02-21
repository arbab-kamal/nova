"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Zap, ArrowLeft, Save, X } from "lucide-react";

// Assuming you have a ChatBox component
import ChatBox from "../chat/index";

const ProjectDashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isAddToProjectOpen, setIsAddToProjectOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);

  const projects = [
    {
      id: 1,
      title: "Design Studio Copywriting",
      description:
        "This project is for copywriting purpose. Make easier to create copy for client and design.",
      image: "/book.jpg",
      admin: "James Cargo",
      chatCount: 12,
      promptCount: 4,
    },
    {
      id: 2,
      title: "All Movie Series Project",
      description:
        "This project is for copywriting purpose. Make easier to create copy for movie and series.",
      image: "/book2.jpg",
      admin: "James Cargo",
      chatCount: 12,
      promptCount: 4,
    },
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
  };

  const handleAddToProject = (projectId) => {
    // Add your save logic here
    console.log("Adding to project:", projectId);
    setIsAddToProjectOpen(false);
  };

  // Add to Project Modal
  const AddToProjectModal = () => (
    <Dialog open={isAddToProjectOpen} onOpenChange={setIsAddToProjectOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add to Project</DialogTitle>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setIsAddToProjectOpen(false)}
          />
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <span>Add to Project</span>
          <Button
            variant="link"
            className="text-blue-600 p-0"
            onClick={() => {
              setIsAddToProjectOpen(false);
              setIsCreateOpen(true);
            }}
          >
            + Create New Project
          </Button>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{project.chatCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>{project.promptCount}</span>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAddToProject(project.id)}
                >
                  +Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (selectedProject) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">{selectedProject.title}</h1>
          </div>
          <Button
            onClick={() => setIsAddToProjectOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save to Project
          </Button>
        </div>
        <ChatBox projectId={selectedProject.id} />
        <AddToProjectModal />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Project</h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Create New Project
        </Button>
      </div>

      <h2 className="text-sm text-gray-600 mb-4">All Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleProjectClick(project)}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{project.title}</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle menu click
                  }}
                >
                  •••
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="/1.jpeg"
                    className="w-6 h-6 rounded-full bg-gray-200"
                  />
                  <span className="text-sm">{project.admin}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      {project.chatCount}
                    </span>
                    <span className="text-gray-400">AI Chat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      {project.promptCount}
                    </span>
                    <span className="text-gray-400">Prompt Assist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Create New Project</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsCreateOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-4">
            <div className="border-2 border-dashed rounded-lg p-8 mb-4 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-blue-600">+</span>
              </div>
              <p className="text-sm text-gray-500">
                Drag & Drop you image here,
                <br />
                or you can <span className="text-blue-600">browse</span> instead
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="Enter project title" />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter project description"
                  className="resize-none"
                />
              </div>
            </div>

            <Button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsCreateOpen(false)}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDashboard;
