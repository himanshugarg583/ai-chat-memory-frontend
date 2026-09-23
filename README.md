# AI Chat with Memory - Frontend

A Next.js 14 frontend for the AI Chat & Memory Management system.

## Features

- 💬 **Real-time Chat** - Smooth chat interface with typing indicators
- 🧠 **Memory Panel** - View, edit, add, and delete memories
- 🔄 **Memory Status** - See which memories were used in responses
- ✏️ **Inline Editing** - Edit memories directly in the panel
- 🏷️ **Categories** - Filter memories by category
- 📱 **Responsive** - Works on desktop and mobile

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on port 3000

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The frontend runs on `http://localhost:3001` by default (Next.js will use 3001 if 3000 is in use).

API requests are proxied to `http://localhost:3000/api` via `next.config.js`.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── globals.css      # Global styles + Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page component
├── components/
│   ├── Chat.tsx         # Chat interface
│   ├── MemoryPanel.tsx  # Memory management panel
│   └── LoginModal.tsx   # Login screen
├── lib/
│   └── api.ts           # API client
├── types/
│   └── index.ts         # TypeScript types
└── next.config.js       # Next.js config with API proxy
```

## Environment

The frontend proxies API calls to the backend. Make sure the backend is running on port 3000.

To change the backend URL, edit `next.config.js`:

```js
destination: 'http://localhost:3000/api/:path*',
```

## Features in Detail

### Chat Panel
- Message history with memory status indicators
- Collapsible "Memory details" showing:
  - Memories used with similarity scores
  - Memory changes (created, updated, removed)
- Typing indicator during API calls
- New session button

### Memory Panel
- Active/All filter toggle
- Category badges (personal, technical, preference, general)
- Source indicator (auto/manual)
- Inline editing with Enter to save, Esc to cancel
- Delete confirmation
- Add new memory with category selection

## License

ISC
