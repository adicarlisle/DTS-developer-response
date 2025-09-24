import {
  isRouteErrorResponse,
  Links,
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
      <nav style={{ 
        padding: '1rem 2rem', 
        backgroundColor: '#2c3e50', 
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <NavLink 
            to="/" 
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              textDecoration: 'none',
              color: '#ecf0f1',
              transition: 'color 0.3s'
            }}
          >
            📋 Task Manager
          </NavLink>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#3498db' : '#ecf0f1',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'all 0.3s',
                backgroundColor: isActive ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                ':hover': {
                  color: '#3498db'
                }
              })}
            >
              📝 All Tasks
            </NavLink>
            
            <NavLink 
              to="/api-docs" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#3498db' : '#ecf0f1',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'all 0.3s',
                backgroundColor: isActive ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
              })}
            >
              📚 API Docs
            </NavLink>
            
            <NavLink 
              to="/tasks/new" 
              style={{ 
                textDecoration: 'none', 
                backgroundColor: '#3498db', 
                color: 'white', 
                padding: '0.6rem 1.2rem', 
                borderRadius: '6px',
                fontWeight: '500',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(52, 152, 219, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                ':hover': {
                  backgroundColor: '#2980b9',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2980b9';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3498db';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(52, 152, 219, 0.2)';
              }}
            >
              ➕ New Task
            </NavLink>
          </div>
        </div>
      </nav>
      
      <main style={{ 
        padding: '0 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {children}
      </main>
    </>
  );
}

export default function App() {
  return <Outlet />;
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
