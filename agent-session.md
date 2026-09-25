# Agent session — prompts and outcomes

Tool used: Claude (chat interface), not via a Claude Pro/Max subscription —
used through (free tier). Each feature was planned and implemented as a separate,
sequential request rather than one large generation.

Built step by step across separate requests, not generated in one shot —
each feature was planned, implemented, tested, and committed before
moving to the next.

| Prompt (my request)                         | Outcome                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| Understand task requirements from the brief | Full requirement breakdown, clarified GET/POST/PATCH contract |

| Server-only Appwrite access (no client SDK), TanStack Start server functions |

| Feature-based vs FSD structure decision | Chose flat feature-based — project too small for FSD's extra layers |
| Set up TypeScript strict, ESLint, Prettier, Husky | Real strict config, type-aware ESLint, pre-commit hooks — verified with a test commit |
| Set up CI without branches/PRs | Push-triggered GitHub Actions workflow (typecheck, lint, format, build) |
| Build email-code sign-in flow | Working two-step login; caught and fixed wrong Appwrite SDK params and a returning-user bug (new random userId broke repeat sign-ins) |
| Build onboarding flow | Form with idempotent submit; caught and fixed a Seroval serialization error from importing server-only constants into a client component |
| Build SSR header with no flicker | Header reads Personal Account's firstName via root loader; caught and fixed a client/server import-boundary bug and a missing router.invalidate() after login |
| Build profile page | View/edit form respecting the Function's omit-vs-null PATCH contract; role shown but not editable |
| Build logout | Session deletion + cookie clear + header invalidation |
| Add no-console ESLint rule | Blocks console.log in production, allows warn/error |
| Fix CI build failure | `.server.ts` imported directly into route files broke production build (dev server didn't catch it) — moved auth checks behind createServerFn wrappers |
| Manual QA plan | Full checklist covering brief requirements, used instead of automated E2E/unit tests due to time budget |
