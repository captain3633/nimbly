# Nimbly Web App

Next.js web application for Nimbly - Track receipts, understand spending patterns.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** Custom components following shadcn/ui patterns
- **Icons:** Lucide React

## Design System

The app follows the Nimbly visual system defined in `docs/visuals.md`:

### Colors

- **Sage (#5F7D73):** Primary color for Savvy moments, links, and primary actions
- **Amber (#D9A441):** Accent color for deals and highlights (use sparingly)
- **Light/Dark Mode:** Full support from day one

### Components

- `Button`: Primary, secondary, ghost, and link variants
- `Card`: Container with header, content, and footer sections
- `Input`: Form input with focus states
- `ThemeToggle`: Light/dark mode switcher

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
web/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with design tokens
├── components/
│   ├── ui/                # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Theme switcher component
└── lib/
    └── utils.ts           # Utility functions (cn helper)
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Design Principles

- **Calm and trustworthy:** No visual flair, focus on clarity
- **Accessible:** WCAG AA compliant, keyboard navigation
- **Responsive:** Mobile-first design
- **Performance:** Optimized images, code splitting

## Next Steps

- Implement authentication flow (UI-2)
- Build receipt upload flow (UI-4)
- Create receipt list and detail views (UI-6, UI-8)
- Add insights feed (UI-10)
