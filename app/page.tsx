"use client";

import { useState } from "react";
import { PDFUpload } from "@/components/pdf-upload";
import { QueryInput } from "@/components/query-input";
import { AnswerDisplay } from "@/components/answer-display";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import { queryRag } from "@/features/document/querydoc";

export default function Home() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [context, setContext] = useState<string>("");
  const [citation, setCitations] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // ✅ NEW

  const { toast } = useToast();

  const handleUploadSuccess = () => {
    setHasDocument(true);
    setAnswer(null);
    setCurrentQuery(null);
    setContext("");
    setCitations([]);
  };

  const handleQuerySubmit = async (query: string) => {
    if (!hasDocument) {
      toast({
        title: "No document uploaded",
        description: "Please upload a PDF document first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentQuery(query);
    setAnswer(null);
    setContext("");
    setCitations([]);

    try {
      const data = await queryRag({ question: query });
      setAnswer(data.answer || "No answer generated");
      setContext(data.context);
      setCitations(data.citations);
    } catch {
      toast({
        title: "Query failed",
        description: "Failed to process your question. Please try again.",
        variant: "destructive",
      });
      setAnswer(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              RAG Document Q&A
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Upload PDF documents and ask questions powered by LLM
          </p>
        </div>

        <div className="space-y-6">
          <PDFUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadingChange={setIsUploading} // ✅ KEY WIRING
          />

          <QueryInput
            onQuerySubmit={handleQuerySubmit}
            isLoading={isLoading}
            disabled={!hasDocument || isUploading} // ✅ GPT-style behavior
          />

          <AnswerDisplay
            answer={answer}
            isLoading={isLoading}
            query={currentQuery}
            context={context}
            citations={citation}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
