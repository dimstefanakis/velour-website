# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start development server with Turbopack on localhost:3000

# Production
npm run build        # Build for production with Turbopack
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Project Overview

This is a Next.js 15.5.2 landing page for a romance audio drama app, targeting mature women (30-55) seeking emotional escape through bite-sized audio stories.

## Technical Architecture

- **Framework**: Next.js 15.5.2 with App Router (src/app directory structure)
- **Styling**: Tailwind CSS v4 with PostCSS
- **TypeScript**: Strict mode enabled with path aliases (@/* → ./src/*)
- **Fonts**: Geist and Geist_Mono from Google Fonts
- **Build**: Turbopack enabled for both dev and build

## Key Design Requirements

The landing page must follow specifications in SPECS.md and COPY.md:

- **Visual Design**: Warm, romantic, mature aesthetic (rose, blush, muted gold, deep plum colors)
- **Typography**: Elegant serif for headings (e.g., Playfair Display), clean sans-serif for body
- **Tone**: Intimate, mysterious, emotional - "like a secret club for romance lovers"

## Landing Page Structure

1. Hero Section with email capture
2. Emotional Hook section
3. How It Works (3 simple steps with icons)
4. Testimonials (placeholder quotes)
5. Final CTA with email capture
6. Minimal footer

## Development Notes

- Main entry point: src/app/page.tsx
- Global styles: src/app/globals.css
- Root layout with metadata: src/app/layout.tsx
- ESLint configured with Next.js recommended rules