## Repo-specific Copilot instructions for hrms-backend

This file gives concise, actionable guidance for AI coding agents working in this repository (backend Node/Express + MongoDB).

- Project entry: `server.js` — starts Express, mounts routers under `/api/*`, and connects to MongoDB via `dbConfig/db.js`.
- Start in development: `npm run dev` (uses `nodemon server.js`). Production: `npm start`.
- Configuration: `config/index.js` centralizes server, database, JWT, email and file-upload settings. Prefer reading/updating there instead of scattered environment variables.

- Routing pattern: `routes/*.js` creates Express routers (e.g. `userRoutes`, `personalDetailsRoutes`, `documentRoutes`, `masterRoutes`) and are mounted in `server.js`:
  - `app.use('/api/employee', userRoutes)` — user-related endpoints live under `/api/employee`.

- Controllers in `controller/*` contain request handlers. Controllers call Mongoose models in `model/*` and utility helpers in `utils/*`.
  - Example: `controller/userController.js` uses `User_Model` (`model/userModel.js`), `utils/jwt.js`, `utils/Email.js`, `utils/username.js`, and `htmltemplete/newEmployetemplate.js`.

- Database: Mongoose is used. `dbConfig/db.js` connects using `config.database.mongodb.uri`. Models often use custom collection names (e.g. `Users`). Use `await connectDatabase()` in boot or tests.

- Auth and tokens: `utils/jwt.js` exposes `generateTokenPair`, `verifyToken`, `extractTokenFromHeader`. Authentication middleware (`middlewares/auth.js`) expects an Authorization header `Bearer <token>` and adds `req.user` with minimal fields. Authorization is role-based via `authorizeRoles(['admin','manager'])`.

- File uploads: `express-fileupload` is configured in `server.js` (50MB limit) and uploaded files are served under `/api/files` from the `uploads/` folder. Document upload routes are protected by `authenticateToken` (see `routes/documentRoutes.js`).

- Email: `utils/Email.js` uses nodemailer and credentials from `config.email.auth`. Email templates are in `htmltemplete/newEmployetemplate.js` and text fallback functions are provided.

- Conventions & patterns to follow when editing code:
  - Keep environment defaults in `config/index.js`. Use `process.env` only for overrides.
  - Controllers return responses using `config.statusCodes` and `config.messages`.
  - Use `async/await` and try/catch in controllers; log errors with a clear prefix (e.g. `console.error("Login error:", error)`)
  - Model names often use explicit collection name in `mongoose.model('Users', schema, 'Users')` — be careful when referencing collection names in aggregation lookups (case-sensitive strings like `'Users'`, `'PersonalDetails'`).

- Quick examples (use exact files as references):
  - Add a protected route: update `routes/userRoutes.js` and add handler in `controller/userController.js`; use `authenticateToken` and `authorizeRoles([...])` as needed.
  - Generate tokens in controllers using `utils/jwt.js` -> `generateTokenPair(user)` and return `accessToken` + `refreshToken`.
  - To send email, call `sendEmailGmail(email, htmlTemplate, subject)` from `utils/Email.js`.

- Developer workflows & debugging tips:
  - Run dev server: `npm run dev`. Ensure `MONGODB_URI` in env (or default to local `mongodb://localhost:27017/hrmsDB`).
  - Static files: Uploaded files are available at `http://<host>:<port>/api/files/<relative-path>` (configured in `server.js`).
  - If JWT errors occur, check `config.jwt.secret` and `config.jwt.issuer`/`audience` matches both token generation and verification.

- Known quirks / gotchas discovered in the code:
  - `htmltemplete/newEmployetemplate.js` references `req.headers` inside a pure helper (bug) — don't rely on `req` being available there; prefer `config.server.baseUrl` or pass frontend base URL explicitly.
  - Some aggregation `$lookup` stages in controllers reference collection names with specific casing (e.g. `from: 'Users'`). Changing model collection names will break those lookups.
  - `config.messages` is declared twice in `config/index.js` (merged values). Prefer reading the exported `config` object at runtime.

- When adding tests or refactors:
  - Keep API response shapes consistent with existing endpoints (see `userController` responses). Tests should mock `mongoose` or use a test database.
  - When changing role strings (e.g., `manager`, `admin`), update all usages in `authorizeRoles` calls and seeded data.

- Where to look first for common tasks:
  - Add endpoint: `routes/*` -> `controller/*` -> `model/*` -> `utils/*` (if required).
  - Investigate auth issues: `utils/jwt.js`, `middlewares/auth.js`, `config/index.js`.
  - File upload issues: `server.js` (fileUpload config) and `controller/documentController.js`.

If anything here is unclear or you want more examples (tests, common PR comments, or coding style rules), tell me which area to expand and I will iterate.
