# AI Chat Memory — Frontend

Next.js 14 frontend for the AI Chat & Memory system.

## Features

- Real-time chat with typing indicators and memory context
- Memory panel with inline editing, category filtering, and CRUD
- Responsive layout for desktop and mobile

## Tech Stack

| Layer     | Technology           |
|-----------|---------------------|
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript           |
| Styling   | Tailwind CSS         |
| Icons     | Lucide React         |

## Quick Start

```bash
npm install
npm run dev        # Development at localhost:3000
npm run build      # Production build
```

Backend must be running on port 8000. Requests are proxied via `next.config.js`.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── features/
│   ├── chat/               # Chat feature module
│   │   └── ChatScreen.tsx
│   └── memories/           # Memories feature module
│       └── MemoriesScreen.tsx
├── hooks/
│   ├── useChat.ts          # Chat state management
│   └── useMemories.ts      # Memory state management
├── components/ui/          # Shared UI components
│   ├── ErrorBanner.tsx
│   └── Spinner.tsx
├── lib/
│   ├── api.ts              # HTTP client
│   ├── constants.ts        # Shared constants
│   └── format.ts           # Formatting utilities
└── types/
    └── index.ts            # Type definitions
```

## Environment

Set `BACKEND_URL` to change backend endpoint, or edit the proxy in `next.config.js`.

## License

ISC
