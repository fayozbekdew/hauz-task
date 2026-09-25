# Notes

## 1. Architecture

I chose a **feature-based architecture** because it is sufficient for the current project scope and keeps the codebase simple and easy to understand.

For a larger application with more features and stronger dependencies between them, I would consider **FSD** or a more modular architecture. For independently developed and deployed parts of a much larger product, **micro-frontends** could also be considered.

### 2. CI/CD

I set CI/CD to run checks only when code is pushed to the `main` branch because I worked on the project alone. If the project had a team, I would run CI when a Pull Request (PR) is opened to check the code before merging it into `main`.

### 3. E2E Testing

I planned to add E2E tests, but I did not have enough time because of the deadline. Instead, I manually tested the main flows based on the project requirements. In a real project, I would add E2E tests using Playwright or Cypress.

### 4. Code Quality

To keep the code quality, I used strict TypeScript, Prettier, ESLint, and Husky. I also usually use Stylelint, but I did not add it here because styling was not the main focus of this project.

## Brief deviation: caller identity

The brief says the profile form should send the caller's id along with
changes. The Function's own source (`main.js`) documents that it never
trusts a caller-supplied id — only `x-appwrite-user-id`, injected by
Appwrite from the session behind the execution. I followed the Function's
actual behavior: the frontend authenticates each execution with the
user's session, and never sends an id.

## Agent mistakes I caught

1. Generated a new random `userId` for every sign-in request instead of using the existing Appwrite User's id for the same email. This caused an "Invalid token" error for returning users because the token was linked to the wrong id. I found this while testing sign-in with the same email again and fixed it before committing the sign-in flow (`c0b1b80`).

2. Used `functions.createExecution({ path, method: 'GET' })` with the wrong parameter name (`xpath`, not `path`) and the wrong type (`ExecutionMethod` enum, not a plain string). I found this error with `tsc` during development and fixed it before committing the client helper (`87cc9db`).

3. Imported a `.server.ts` module directly into route files (`profile.tsx`, `__root.tsx`). It worked in `npm run dev`, but the production build failed. TanStack Start checks the client/server import rules during the build. I found this because CI failed after a push and fixed it in commit `b64beee`.
