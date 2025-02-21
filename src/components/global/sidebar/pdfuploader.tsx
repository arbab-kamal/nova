"use client";
// import { useState, useRef, useCallback, useMemo } from "react";
// import {
//   Upload,
//   FileIcon,
//   Loader2,
//   X,
//   AlertCircle,
//   CheckCircle2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";

// const PDF_UPLOADER = "http://localhost:8080/upload";
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ACCEPTED_TYPES = ["application/pdf"];

// interface UploadResponse {
//   success: boolean;
//   message?: string;
//   fileUrl?: string;
// }

// interface FileData {
//   file: File;
//   progress: number;
//   status: "idle" | "uploading" | "completed" | "error";
//   error?: string;
//   fileUrl?: string;
// }

// const getProgressColor = (progress: number): string => {
//   return "bg-blue-500";
// };

// const CustomProgress = ({ value }: { value: number }) => {
//   return (
//     <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
//       <div
//         className={`h-full transition-all duration-300 ${getProgressColor(
//           value
//         )}`}
//         style={{ width: `${value}%` }}
//       />
//     </div>
//   );
// };

// const MultiplePDFUploader = () => {
//   const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const abortControllersRef = useRef<Map<number, AbortController>>(new Map());

//   const totalProgress = useMemo(() => {
//     if (!uploadedFiles.length) return 0;
//     const total = uploadedFiles.reduce((sum, file) => sum + file.progress, 0);
//     return Math.round(total / uploadedFiles.length);
//   }, [uploadedFiles]);

//   const validateFile = (file: File): string | null => {
//     if (!ACCEPTED_TYPES.includes(file.type)) {
//       return "Invalid file type. Please upload PDF files only.";
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       return "File size exceeds 10MB limit.";
//     }
//     return null;
//   };

//   const uploadFile = useCallback(async (file: File, fileIndex: number) => {
//     const abortController = new AbortController();
//     abortControllersRef.current.set(fileIndex, abortController);

//     setUploadedFiles((prev) =>
//       prev.map((item, index) =>
//         index === fileIndex
//           ? { ...item, status: "uploading", progress: 0, error: undefined }
//           : item
//       )
//     );

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const xhr = new XMLHttpRequest();

//       xhr.upload.addEventListener("progress", (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round((event.loaded * 100) / event.total);
//           setUploadedFiles((prev) =>
//             prev.map((item, index) =>
//               index === fileIndex ? { ...item, progress } : item
//             )
//           );
//         }
//       });

//       const uploadPromise = new Promise((resolve, reject) => {
//         xhr.addEventListener("load", () => {
//           if (xhr.status >= 200 && xhr.status < 300) {
//             try {
//               const response = JSON.parse(xhr.responseText);
//               resolve(response);
//             } catch (error) {
//               reject(new Error("Invalid response format"));
//             }
//           } else {
//             reject(new Error(`Upload failed with status: ${xhr.status}`));
//           }
//         });

//         xhr.addEventListener("error", () =>
//           reject(new Error("Network error occurred"))
//         );

//         xhr.addEventListener("abort", () =>
//           reject(new Error("Upload cancelled"))
//         );
//       });

//       xhr.open("POST", PDF_UPLOADER);
//       xhr.send(formData);

//       abortController.signal.addEventListener("abort", () => xhr.abort());

//       const data: UploadResponse = await uploadPromise;

//       if (data.success) {
//         setUploadedFiles((prev) =>
//           prev.map((item, index) =>
//             index === fileIndex
//               ? {
//                   ...item,
//                   status: "completed",
//                   progress: 100,
//                   fileUrl: data.fileUrl,
//                 }
//               : item
//           )
//         );
//         toast.success(`${file.name} uploaded successfully`);
//       } else {
//         throw new Error(data.message || "Upload failed");
//       }
//     } catch (error) {
//       if (error.name === "AbortError") {
//         console.log("Upload cancelled");
//         return;
//       }

//       setUploadedFiles((prev) =>
//         prev.map((item, index) =>
//           index === fileIndex
//             ? {
//                 ...item,
//                 status: "error",
//                 error: error instanceof Error ? error.message : "Upload failed",
//                 progress: 0,
//               }
//             : item
//         )
//       );
//       toast.error(`Failed to upload ${file.name}`);
//       console.error("Upload error:", error);
//     } finally {
//       abortControllersRef.current.delete(fileIndex);
//     }
//   }, []);

//   const handleFiles = useCallback(
//     (files: File[]) => {
//       const validFiles: File[] = [];
//       const errors: string[] = [];

//       files.forEach((file) => {
//         const error = validateFile(file);
//         if (error) {
//           errors.push(`${file.name}: ${error}`);
//         } else {
//           validFiles.push(file);
//         }
//       });

//       if (errors.length) {
//         toast.error(errors.join("\n"));
//       }

//       if (validFiles.length) {
//         setIsOpen(false);
//         const newFiles = validFiles.map((file) => ({
//           file,
//           progress: 0,
//           status: "idle" as const,
//         }));

//         setUploadedFiles((prev) => [...prev, ...newFiles]);

//         validFiles.forEach((file, index) => {
//           const fileIndex = uploadedFiles.length + index;
//           uploadFile(file, fileIndex);
//         });
//       }
//     },
//     [uploadFile, uploadedFiles.length]
//   );

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault();
//       setIsDragging(false);
//       const droppedFiles = Array.from(e.dataTransfer.files);
//       handleFiles(droppedFiles);
//     },
//     [handleFiles]
//   );

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   const handleRemoveFile = useCallback((index: number) => {
//     const controller = abortControllersRef.current.get(index);
//     if (controller) {
//       controller.abort();
//     }
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   const FileStatusIcon = ({ status }: { status: FileData["status"] }) => {
//     switch (status) {
//       case "uploading":
//         return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
//       case "completed":
//         return <CheckCircle2 className="w-4 h-4 text-green-500" />;
//       case "error":
//         return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="relative">
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogTrigger asChild>
//           <Button
//             className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
//             disabled={uploadedFiles.some((f) => f.status === "uploading")}
//           >
//             <Upload className="w-4 h-4" />
//             <span>Upload PDFs</span>
//           </Button>
//         </DialogTrigger>

//         <DialogContent className="sm:max-w-[425px]">
//           <DialogTitle className="text-xl font-semibold mb-4">
//             Upload PDFs
//           </DialogTitle>

//           <div
//             className={`
//               border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
//               ${
//                 isDragging
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
//               }
//             `}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onClick={() => fileInputRef.current?.click()}
//             role="button"
//             tabIndex={0}
//           >
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".pdf"
//               multiple
//               className="hidden"
//               onChange={(e) => handleFiles(Array.from(e.target.files || []))}
//             />
//             <Upload className="mx-auto h-12 w-12 mb-4 text-blue-500" />
//             <p className="text-sm text-gray-600">
//               {isDragging
//                 ? "Drop files here"
//                 : "Click to select or drag and drop PDF files"}
//             </p>
//             <p className="text-xs mt-2 text-gray-500">
//               Maximum file size: 10MB
//             </p>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {uploadedFiles.length > 0 && (
//         <div className="fixed bottom-4 right-4 w-96 shadow-xl rounded-lg p-4 bg-white border border-gray-200 space-y-4">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="font-medium">Uploads ({uploadedFiles.length})</h3>
//             <span className="text-sm text-gray-500">
//               {totalProgress}% Complete
//             </span>
//           </div>

//           <CustomProgress value={totalProgress} />

//           <div className="max-h-60 overflow-y-auto space-y-3">
//             {uploadedFiles.map((fileData, index) => (
//               <div
//                 key={`${fileData.file.name}-${index}`}
//                 className="p-3 bg-gray-50 rounded-lg"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2 max-w-[70%]">
//                     <FileIcon className="w-4 h-4 text-blue-500" />
//                     <span
//                       className="text-sm font-medium truncate"
//                       title={fileData.file.name}
//                     >
//                       {fileData.file.name}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <FileStatusIcon status={fileData.status} />
//                     <button
//                       className="p-1 text-gray-400 hover:text-red-600 rounded-full"
//                       onClick={() => handleRemoveFile(index)}
//                       disabled={fileData.status === "uploading"}
//                       aria-label="Remove file"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {fileData.status === "error" ? (
//                   <p className="text-red-500 text-xs mt-1">{fileData.error}</p>
//                 ) : (
//                   <CustomProgress value={fileData.progress} />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiplePDFUploader;
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

const PDF_UPLOADER = "http://localhost:8080/upload";

const MultiplePDFUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      progress: number;
      status: "idle" | "uploading" | "completed" | "error";
      error?: string;
    }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File, fileIndex: number) => {
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
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadedFiles((prev) =>
            prev.map((item, index) =>
              index === fileIndex ? { ...item, progress } : item
            )
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadedFiles((prev) =>
            prev.map((item, index) =>
              index === fileIndex
                ? { ...item, status: "completed" as const, progress: 100 }
                : item
            )
          );
        } else {
          throw new Error(`Upload failed with status: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        throw new Error("Upload failed due to network error");
      };

      xhr.open("POST", PDF_UPLOADER);
      await xhr.send(formData);
    } catch (error) {
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
      console.error("Upload error:", error);
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
        console.warn("Please upload valid PDF files.");
      }
    },
    [uploadFile, uploadedFiles.length]
  );

  const handleRemoveFile = useCallback((index: number) => {
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
                      : `${fileData.progress}% Uploaded`}
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
