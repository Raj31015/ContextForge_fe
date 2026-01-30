"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";

interface AnswerDisplayProps {
  answer: string | null;
  isLoading?: boolean;
  query?: string | null;
}

export function AnswerDisplay({
  answer,
  isLoading = false,
  query,
}: AnswerDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Generating answer...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!answer && !query) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Upload a document and ask a question to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Answer
        </CardTitle>
        {query && (
          <p className="text-sm text-muted-foreground font-normal">
            Question: {query}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap leading-relaxed">{answer}</p>
        </div>
      </CardContent>
    </Card>
  );
}
