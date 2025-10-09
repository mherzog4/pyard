# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a take-home project assignment for building a search and matching API. The goal is to implement a scoring-based search function and music artist management functionality, exposed via HTTP endpoints.

**Key Requirements:**
- Build as if part of a production-ready codebase with proper structure, configuration, and tests
- Focus on API implementation (no UI required)
- Case-insensitive substring matching with scoring system
- In-memory dataset management

## Core Functionality

### Search Scoring System

The search function uses a weighted scoring system for matching query strings against people:
- **Name match:** 4 points
- **Musical artist match:** 2 points
- **Music genre match:** 1 point
- **Movie match:** 1 point
- **Location match:** 1 point

**Important matching rules:**
- All matches are case-insensitive
- Matches are substring-based (e.g., "nni" matches "Bonnie Wang")
- Each property category counts at most once toward the score (e.g., searching "the" matches multiple movies for one person, but only adds 1 point)
- Results must be sorted descending by score, then by name
- Only return results with score > 0

### Data Model

The dataset consists of:
1. **People** - with name, music genres, movies, and location
2. **Music Artists** - organized by genre (Rock, Country, Classical, Jazz, Ska, Blues)

The dataset is provided unformatted in README.md and must be structured appropriately.

## Development Commands

### TypeScript
- Compile TypeScript: `npx tsc` (requires tsconfig.json to be created)
- Run with ts-node: `npx ts-node main.ts` (requires ts-node installation)

### Node.js
- Run compiled code: `node dist/main.js` (after compilation)
- Install dependencies: `npm install`

### Testing
No test framework is currently configured. Consider adding:
- `npm install --save-dev jest @types/jest ts-jest` for Jest
- `npm install --save-dev mocha @types/mocha chai` for Mocha

## Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript 5.9.3
- **Framework:** Express 5.1.0
- **Dependencies:** Minimal (only Express and its types)

## Project Structure Notes

The project currently has a minimal structure with:
- `main.ts` - Entry point (currently just "hello world")
- `package.json` - Dependencies and scripts
- `README.md` - Assignment requirements and dataset

**Recommended structure for production-ready code:**
```
src/
  models/      # Data models and types
  services/    # Business logic (search, artist management)
  routes/      # Express route handlers
  middleware/  # Error handling, validation
  utils/       # Helper functions
  data/        # Dataset initialization
  app.ts       # Express app setup
  server.ts    # Server startup
tests/
  unit/        # Unit tests
  integration/ # API integration tests
dist/          # Compiled output
```

## API Requirements

Implement two HTTP endpoints:
1. **Search** - query parameter for search string, returns scored results
2. **Add Music Artist** - accepts genre and artist name, modifies in-memory dataset

API documentation should be provided (OpenAPI spec or comprehensive README examples).

## Configuration Missing

The following should be created:
- `tsconfig.json` - TypeScript compiler configuration
- `.gitignore` - Ignore node_modules, dist, etc.
- Test configuration for chosen testing framework
- ESLint/Prettier configuration for code quality

## Dataset Reference

The complete dataset with 6 people and music artists across 6 genres is documented in README.md. This must be parsed and loaded into memory at application startup.
