"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ingestDocument } from "@/features/document/ingestdoc";
import { uploadPdf } from "@/features/document/upload";

/* =========================
   Types
========================= */

type UploadStatus = "uploading" | "processing" | "done" | "error";

type UploadItem = {
  file: File;
  status: UploadStatus;
};

interface PDFUploadProps {
  onUploadSuccess?: (docId: string) => void;
  onUploadingChange?: (uploading: boolean) => void; // optional hook for Ask button
}

/* =========================
   Component
========================= */

export function PDFUpload({
  onUploadSuccess,
  onUploadingChange,
}: PDFUploadProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  /* =========================
     Drop handler
  ========================= */

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Validate
      for (const file of acceptedFiles) {
        if (file.type !== "application/pdf") {
          toast({
            title: "Invalid file type",
            description: "Please upload only PDF files.",
            variant: "destructive",
          });
          return;
        }
      }

      const newItems: UploadItem[] = acceptedFiles.map((file) => ({
        file,
        status: "uploading",
      }));

      setUploads((prev) => [...prev, ...newItems]);
      setIsUploading(true);
      onUploadingChange?.(true);

      // Sequential processing (safe + predictable)
      for (const item of newItems) {
        try {
          // Uploading
          setUploads((prev) =>
            prev.map((u) =>
              u.file === item.file ? { ...u, status: "uploading" } : u
            )
          );

          const { docId, filename } = await uploadPdf(item.file);

          // Processing / indexing
          setUploads((prev) =>
            prev.map((u) =>
              u.file === item.file ? { ...u, status: "processing" } : u
            )
          );

          await ingestDocument(docId, filename);
          onUploadSuccess?.(docId);

          // Done
          setUploads((prev) =>
            prev.map((u) =>
              u.file === item.file ? { ...u, status: "done" } : u
            )
          );
        } catch (err) {
          setUploads((prev) =>
            prev.map((u) =>
              u.file === item.file ? { ...u, status: "error" } : u
            )
          );
        }
      }

      setIsUploading(false);
      onUploadingChange?.(false);

      toast({
        title: "Documents processed",
        description: `${acceptedFiles.length} PDF(s) indexed successfully.`,
      });
    },
    [toast, onUploadSuccess, onUploadingChange]
  );

  /* =========================
     Dropzone
  ========================= */

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 10,
    disabled: isUploading,
  });

  /* =========================
     Render
  ========================= */

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-3">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop your PDFs here"
                : "Drag & drop PDF files here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse (up to 10 PDFs)
            </p>
          </div>
        </div>

        {/* File List */}
        {uploads.length > 0 && (
          <div className="space-y-3">
            {uploads.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* Status */}
                {item.status === "uploading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {item.status === "processing" && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
                {item.status === "done" && (
                  <span className="text-xs text-green-600">Ready</span>
                )}
                {item.status === "error" && (
                  <span className="text-xs text-red-600">Failed</span>
                )}
              </div>
            ))}

            {isUploading && (
              <p className="text-xs text-muted-foreground">
                Indexing documents… you can type your question meanwhile.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
