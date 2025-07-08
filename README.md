# ProjectFlow - AI-Powered Project Management

ProjectFlow is a modern, full-stack project management application designed to streamline your workflow. It features a comprehensive set of tools for managing projects, tasks, and teams, enhanced with powerful AI capabilities for risk analysis and automated task generation.

![ProjectFlow Dashboard](https://placehold.co/800x400.png)

## ✨ Features

- **📊 Interactive Dashboard**: Get a high-level overview of project statistics, task statuses, and recent activities.
- **📁 Project Management**: Create, view, update, and delete projects with ease. All data is persisted in a real-time database.
- **📋 Kanban Board**: Visualize and manage your workflow with a drag-and-drop Kanban board for tasks.
- **👥 Team Management**: Invite and manage team members, assign roles, and track their status.
- **📅 Calendar View**: Keep track of important deadlines and project timelines.
- **🤖 AI Risk Analysis**: Paste project communications (emails, meeting notes) to get an AI-powered assessment of potential risks, their severity, and mitigation strategies.
- **🧠 AI Task Generation**: Describe a high-level goal, and let the AI break it down into smaller, actionable tasks on your Kanban board.
- **🔐 Authentication**: Secure user authentication (Login/Signup) powered by Firebase.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Realtime Database, Authentication)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🔧 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/projectflow.git
    cd projectflow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - In your project, go to **Project settings** > **General**.
    - Under "Your apps," click the Web icon (`</>`) to create a new web app.
    - Copy the `firebaseConfig` object.
    - Open `src/lib/firebase.ts` and replace the existing `firebaseConfig` with your own.
    - In the Firebase Console, go to **Build > Authentication** and enable the **Email/Password** sign-in method.
    - Go to **Build > Realtime Database**, create a database, and start it in **test mode** for easy setup.

4.  **Set up Google AI (Genkit):**
    - Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key.
    - In the root of your project, create a new file named `.env`.
    - Add your API key to the `.env` file:
      ```
      GOOGLE_API_KEY=YOUR_API_KEY_HERE
      ```

5.  **Run the development servers:**
    - You need to run two servers in separate terminals.

    - **Terminal 1: Next.js App**
      ```bash
      npm run dev
      ```
      Your application will be available at `http://localhost:9002`.

    - **Terminal 2: Genkit AI Server**
      ```bash
      npm run genkit:dev
      ```
      This runs the AI flows that power the "Risk Analysis" and "Task Generation" features.

You should now be able to access the application and use all its features locally.

## 📁 Project Structure

The project follows a standard Next.js App Router structure:

```
.
└── src/
    ├── app/                # Next.js pages and layouts
    │   ├── (app)/          # Authenticated routes (Dashboard, Projects, etc.)
    │   └── (auth)/         # Authentication routes (Login, Signup)
    ├── ai/                 # Genkit AI flows and configuration
    │   ├── flows/
    │   └── genkit.ts
    ├── components/         # Reusable React components
    │   └── ui/             # ShadCN UI components
    ├── context/            # React context providers (e.g., AuthContext)
    ├── hooks/              # Custom React hooks (e.g., useAuth)
    └── lib/                # Utility functions and Firebase config
```

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run genkit:dev`: Starts the Genkit development server for AI flows.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code using Next.js's built-in ESLint configuration.
