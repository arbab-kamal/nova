import { useState, useRef, useCallback } from "react";
import { Upload, FileIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast"; // Assuming you have toast component

const PDF_UPLOADER = "http://localhost:8080/upload";

// Type for file upload response
interface UploadResponse {
  success: boolean;
  message?: string;
  fileUrl?: string;
}

const MultiplePDFUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      progress: number;
      status: "idle" | "uploading" | "completed" | "error";
      error?: string;
      fileUrl?: string;
    }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllersRef = useRef<Map<number, AbortController>>(new Map());

  const uploadFile = useCallback(async (file: File, fileIndex: number) => {
    // Create new AbortController for this upload
    const abortController = new AbortController();
    abortControllersRef.current.set(fileIndex, abortController);

    setUploadedFiles((prev) =>
      prev.map((item, index) =>
        index === fileIndex
          ? {
              ...item,
              status: "uploading" as const,
              progress: 0,
              error: undefined,
            }
          : item
      )
    );

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(PDF_UPLOADER, {
        method: "POST",
        body: formData,
        signal: abortController.signal,
        // Add any required headers your API needs
        headers: {
          // 'Authorization': 'Bearer your-token-here', // If needed
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data: UploadResponse = await response.json();

      if (data.success) {
        setUploadedFiles((prev) =>
          prev.map((item, index) =>
            index === fileIndex
              ? {
                  ...item,
                  status: "completed" as const,
                  progress: 100,
                  fileUrl: data.fileUrl,
                }
              : item
          )
        );
        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Upload cancelled");
        return;
      }

      setUploadedFiles((prev) =>
        prev.map((item, index) =>
          index === fileIndex
            ? {
                ...item,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
                progress: 0,
              }
            : item
        )
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to upload ${file.name}`,
      });
      console.error("Upload error:", error);
    } finally {
      abortControllersRef.current.delete(fileIndex);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter(
        (file) => file.type === "application/pdf"
      );

      if (validFiles.length) {
        setIsOpen(false);
        const newFiles = validFiles.map((file) => ({
          file,
          progress: 0,
          status: "idle" as const,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        validFiles.forEach((file, index) => {
          const fileIndex = uploadedFiles.length + index;
          uploadFile(file, fileIndex);
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid files",
          description: "Please upload valid PDF files only.",
        });
      }
    },
    [uploadFile, uploadedFiles.length]
  );

  const handleRemoveFile = useCallback((index: number) => {
    // Cancel ongoing upload if exists
    const controller = abortControllersRef.current.get(index);
    if (controller) {
      controller.abort();
    }

    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const truncateFileName = useCallback(
    (name: string, maxLength: number = 20) => {
      if (name.length <= maxLength) return name;
      return `${name.slice(0, maxLength)}...`;
    },
    []
  );

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload PDFs</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <VisuallyHidden>
            <DialogTitle>Upload PDFs</DialogTitle>
          </VisuallyHidden>

          <div className="grid gap-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              aria-label="PDF files input"
            />
            <div
              className="border-2 border-dashed border-blue-500 rounded-lg p-6 text-center cursor-pointer transition hover:bg-blue-50"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
            >
              <Upload className="mx-auto h-10 w-10 mb-4 text-blue-500" />
              <p className="text-sm text-gray-600">
                Click to select PDF files or drag and drop
              </p>
              <p className="text-xs mt-2 text-gray-500">
                Multiple files allowed
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {uploadedFiles.length > 0 && (
        <div className="fixed bottom-4 right-4 w-80 shadow-lg rounded-lg p-4 z-50 border border-gray-200 bg-white space-y-4">
          {uploadedFiles.map((fileData, index) => (
            <div key={`${fileData.file.name}-${index}`} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 max-w-[80%]">
                  <FileIcon className="w-4 h-4 text-blue-500" />
                  <span
                    className="text-sm font-medium truncate"
                    title={fileData.file.name}
                  >
                    {truncateFileName(fileData.file.name)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {fileData.status === "uploading" && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                  <button
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {fileData.status === "error" ? (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {fileData.error}
                </div>
              ) : (
                <>
                  <Progress
                    value={fileData.progress}
                    className="h-2 w-full bg-gray-100"
                  />
                  <div className="mt-2 text-xs text-center text-gray-500">
                    {fileData.status === "completed"
                      ? "Completed"
                      : `Uploading...`}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiplePDFUploader;
