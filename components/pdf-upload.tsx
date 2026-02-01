"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ingestDocument } from "@/features/document/ingestdoc";
import { uploadPdf } from "@/features/document/upload";
interface PDFUploadProps {
  onUploadSuccess?: (docId:string) => void;
}

export function PDFUpload({ onUploadSuccess }: PDFUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      setIsUploading(true);

      try {
        const {docId,filename}=await uploadPdf(file)
        console.log(docId,filename)
        await ingestDocument(docId,filename)
        toast({
          title: "Upload successful",
          description: "Your document has been processed and indexed.",
        });
        onUploadSuccess?.(docId);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload the document. Please try again.",
          variant: "destructive",
        });
        setUploadedFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [toast, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Uploading and processing document...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {isDragActive
                      ? "Drop your PDF here"
                      : "Drag & drop a PDF file here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
