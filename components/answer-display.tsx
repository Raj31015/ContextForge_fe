"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";

interface AnswerDisplayProps {
  answer: string | null;
  isLoading?: boolean;
  query?: string | null;
  context?:string ;
  citations?:string[]
}

export function AnswerDisplay({
  answer,
  citations,
  context,
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
                    {citations && citations.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="font-medium">Sources</p>
              <ul className="list-disc ml-5 space-y-1">
                {citations.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          {context && (
            <details className="mt-6 border-t pt-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Retrieved context
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                {context}
              </p>
            </details>
          )}
      
        </div>
      </CardContent>
    </Card>
  );
}
