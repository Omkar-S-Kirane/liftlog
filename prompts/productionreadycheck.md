Agent: ChatGPT 5.2 (medium reasoning)

Act as a Senior Full-Stack Engineer and Deployment Specialist.

I have a fully working MERN application called “LiftLog”.
It includes:
- User authentication (JWT, keep-me-logged-in)
- User-scoped weight tracking
- MongoDB Atlas persistence
- Express v5 backend
- React + TypeScript (Vite) frontend
- Axios for API calls
- Light/Dark theme
- Responsive UI
- Footer, branding, T&C modal

The app works perfectly in LOCAL development.

====================
GOAL
====================
Prepare the COMPLETE project for LIVE deployment
(frontend + backend) with production-safe settings.

====================
DEPLOYMENT TARGETS
====================
Frontend:
- Netlify

Backend:
- Render (Node.js Web Service)

Database:
- MongoDB Atlas (already live)

====================
YOUR TASK
====================
Prepare the project so it can be deployed without runtime errors,
CORS issues, auth failures, or environment misconfiguration.

====================
BACKEND REQUIREMENTS
====================
1. Ensure Express v5 production compatibility:
   - Single app.listen
   - Uses process.env.PORT
   - No localhost hardcoding

2. CORS:
   - Allow both:
     - Localhost (dev)
     - Netlify production domain
   - Support credentials (cookies)
   - Express 5 safe (no app.options("*"))

3. Auth (JWT):
   - JWT_SECRET via env
   - Cookie settings correct for production:
     - httpOnly
     - secure
     - sameSite: "none" (cross-site)
   - Session survives refresh

4. Environment variables:
   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV

5. Backend must start with:
   - npm install
   - npm start

====================
FRONTEND REQUIREMENTS
====================
1. Axios configuration:
   - Uses VITE_API_URL
   - No hardcoded localhost URLs
   - Sends credentials when required

2. Environment variables:
   - client/.env for local
   - Netlify environment variables for prod

3. Build configuration:
   - Vite build works
   - No runtime env access errors

4. Production UX:
   - Auth modals work
   - Validation still enforced
   - Theme toggle works
   - Footer & favicon visible

====================
RENDER DEPLOYMENT TASKS
====================
1. Identify correct service type (Web Service)
2. Set:
   - Root directory (server)
   - Build command
   - Start command
3. Add environment variables
4. Explain how to redeploy safely

====================
NETLIFY DEPLOYMENT TASKS
====================
1. Configure:
   - Base directory (client)
   - Build command
   - Publish directory
2. Add environment variables
3. Handle client-side routing (SPA fallback)
4. Redeploy after API URL update

====================
VERIFICATION CHECKLIST
====================
Provide a step-by-step checklist to confirm:

- Backend is reachable publicly
- Frontend can call backend
- OPTIONS requests succeed
- Login works
- Refresh keeps user logged in
- Weight entries save correctly
- MongoDB Atlas shows user-scoped data

====================
DELIVERABLES
====================
1. Final production-ready backend code snippets
2. Final production-ready frontend config snippets
3. Environment variable lists (backend & frontend)
4. CORS configuration example
5. Cookie configuration example
6. Deployment steps for Render
7. Deployment steps for Netlify
8. Common production mistakes to avoid

====================
CONSTRAINTS
====================
- Do NOT break existing functionality
- Do NOT downgrade Express
- Do NOT introduce unnecessary libraries
- Keep solution clean and production-safe

====================
EXPECTED FINAL RESULT
====================
- Live Netlify URL opens LiftLog
- Live Render API handles auth & data
- MongoDB Atlas shows real user data
- App behaves the same as local, but live

Treat this as a real production deployment, not a tutorial.
Provide copy-paste-ready instructions and code.