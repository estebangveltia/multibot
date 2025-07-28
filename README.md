# Multibot Frontend

This repository contains a minimal Next.js application demonstrating a basic multitenant setup. The project uses Supabase for authentication and Tailwind CSS for styling.

## Project structure

```
frontend/        Next.js source code
├── src/
│   ├── app/          Application pages and layout
│   ├── components/   Reusable React components
│   └── lib/          Client-side utilities and context
└── ...              Configuration files
```

All front‑end code lives under the `frontend` directory. The root of the repository only holds this folder and the README.

## Getting started

1. Change into the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (requires Node.js and npm):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

Other available scripts include `npm run build` for production builds and `npm run lint` for linting the codebase.

## License

This project is provided for demonstration purposes and does not include a specific license.
