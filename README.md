# RAG Document Q&A Frontend

A modern, responsive frontend for an LLM-powered RAG (Retrieval-Augmented Generation) system built with Next.js, shadcn/ui, React, and Tailwind CSS.

## Features

- 📄 **PDF Upload**: Drag-and-drop interface for uploading PDF documents
- ❓ **Query Interface**: Clean input for asking questions about uploaded documents
- 💬 **Answer Display**: Beautiful display of AI-generated answers
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- ⚡ **Fast & Responsive**: Optimized for performance and mobile devices

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **shadcn/ui** - High-quality React components
- **Tailwind CSS** - Utility-first CSS framework
- **React Dropzone** - File upload with drag-and-drop

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── upload/route.ts    # API endpoint for PDF uploads
│   │   └── query/route.ts     # API endpoint for queries
│   ├── globals.css            # Global styles and Tailwind config
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── pdf-upload.tsx         # PDF upload component
│   ├── query-input.tsx        # Query input component
│   └── answer-display.tsx     # Answer display component
└── lib/
    └── utils.ts               # Utility functions
```

## Backend Integration

The frontend includes placeholder API routes that need to be connected to your RAG backend:

### Upload Endpoint (`/api/upload`)
- Receives PDF files
- Should integrate with your document processing pipeline
- Expected to handle: text extraction, chunking, embedding generation, vector storage

### Query Endpoint (`/api/query`)
- Receives user queries
- Should integrate with your RAG system
- Expected to handle: query embedding, vector search, context retrieval, LLM generation

### Integration Steps

1. Update `app/api/upload/route.ts` to connect to your document processing service
2. Update `app/api/query/route.ts` to connect to your RAG query service
3. Configure environment variables for your backend URLs/API keys

## Customization

- **Styling**: Modify `app/globals.css` for theme customization
- **Components**: All components are in `components/` and can be customized
- **API Routes**: Update the API routes in `app/api/` to match your backend

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
