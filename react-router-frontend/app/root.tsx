import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <NavLink to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            Task Manager
          </NavLink>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <NavLink to="/" style={{ textDecoration: 'none' }}>All Tasks</NavLink>
            <NavLink 
              to="/tasks/new" 
              style={{ 
                textDecoration: 'none', 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px' 
              }}
            >
              + New Task
            </NavLink>
          </div>
        </div>
      </nav>
      <main style={{ padding: '0 2rem' }}>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
  <>
  <nav>
    <NavLink to="/"> RR</NavLink>
    <div>
    <NavLink to="/"> Items</NavLink>
    <NavLink to="/new"> New Items</NavLink>
    </div>
  </nav>
  <main>
  <Outlet />
  </main>
  </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
