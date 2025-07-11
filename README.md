# 📊 Personalized Content Dashboard-StreamSphere
A **dynamic, user-centric platform** to track and interact with personalized news, recommendations, and social posts — all in one engaging dashboard.  
Built with **React**, **Next.js**, **TypeScript**, **Redux Toolkit**, and modern testing tools.

# Video
https://youtu.be/pGtnjqUhQEw


## 🛠️ Tech Stack

This project uses a **modern frontend stack** for building a dynamic, personalized dashboard:

 **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
-   **UI Library:** [React](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) for managing global UI state.
-   **Forms:** [React Hook Form](https://react-hook-form.com/) for performant and manageable forms.
-   **Backend & Database:**
    -   [Firebase Authentication](https://firebase.google.com/docs/auth) for user management.
    -   [Firebase Firestore](https://firebase.google.com/docs/firestore) for storing user-specific data like favorites.
    -   [Firebase Storage](https://firebase.google.com/docs/storage) for file uploads (e.g., user avatars).
-   **Generative AI:**
    -   [Genkit](https://firebase.google.com/docs/genkit) for building production-ready AI flows.
    -   [Google Gemini](https://ai.google.dev/) for image generation.
-   **End-to-End Testing:** [Playwright](https://playwright.dev/) for robust, automated browser testing.

  ## Key Features
-   **Secure User Authentication:** Full signup, login, and profile management flow using Firebase Authentication.
-   **Personalized Feeds:** A dynamic dashboard that aggregates content from multiple external APIs (NewsAPI, TMDB, Spotify).
-   **Individual User Data:** Each user has their own separate list of favorites, securely stored in Firebase Firestore.
-   **Search & Filtering:** Users can search for specific content and filter by category (Movies, Music, News, etc.).
-   **Responsive Design:** A modern, mobile-first UI built with ShadCN UI and Tailwind CSS.
-   **End-to-End Tested:** User flows are verified with Playwright to ensure reliability.
  
# How to Run
Run **one** of the following commands:

```bash
# Recommended
npm install
# OR if you run into peer dependency issues, use:
npm install --legacy-peer-deps
# to RUN
npm run dev
open the app by clicking or running  [http://localhost:3000]


