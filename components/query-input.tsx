"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QueryInputProps {
  onQuerySubmit: (query: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean; // true when PDFs are uploading
}

export function QueryInput({
  onQuerySubmit,
  isLoading = false,
  disabled = false,
}: QueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || disabled) return;

    await onQuerySubmit(query.trim());
    setQuery("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Enter your question about the uploaded document..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading} // ✅ FIX: typing allowed while uploading
            className="min-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!query.trim() || isLoading || disabled} // ✅ correct
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Ask Question
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
