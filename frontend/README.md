# Frontend

This directory contains a minimal Next.js 14 application configured with Tailwind CSS and Shadcn UI components. Lucide icons are used together with native emojis.

The global chat state is managed using a React Context (`ChatContext`) which persists messages to `localStorage`. Messages are sent to the existing backend endpoint `/api/message` and panel routes can be accessed via helper functions in `src/lib/panel.ts`.

Run `npm run dev` inside this folder to start the development server once dependencies are installed.
