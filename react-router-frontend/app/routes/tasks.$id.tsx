import { useLoaderData, Form, Link, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: "todo" | "in_progress" | "completed" | "cancelled";
    due_date: string;
    created_at: string;
    updated_at: string;
}

export async function loader({ params }: { params: { id: string } }) {
    const apiUrl = process.env.API_URL || 'http://localhost:8000';
    try {
        const response = await fetch(`${apiUrl}/tasks/${params.id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const task: Task = await response.json();
        return task;
    } catch (error) {
        console.error('Failed to fetch task:', error);
        throw new Response("Task not found", { status: 404 });
    }
}

export default function TaskDetail() {
    const task = useLoaderData() as Task;
    const navigate = useNavigate();
    
    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; color: string; icon: string }> = {
            todo: { bg: '#e3f2fd', color: '#1976d2', icon: '📝' },
            in_progress: { bg: '#fff3e0', color: '#f57c00', icon: '🔄' },
            completed: { bg: '#e8f5e9', color: '#388e3c', icon: '✅' },
            cancelled: { bg: '#ffebee', color: '#d32f2f', icon: '❌' }
        };
        const style = styles[status] || styles.todo;
        
        return (
            <span style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                backgroundColor: style.bg,
                color: style.color,
                fontWeight: '600',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                {style.icon} {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    return (
        <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '2rem',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                    }}>
                        <h1 style={{ 
                            margin: 0,
                            color: '#2c3e50',
                            fontSize: '2rem',
                            flex: 1,
                            marginRight: '1rem'
                        }}>
                            {task.title}
                        </h1>
                        {getStatusBadge(task.status)}
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        color: '#6c757d',
                        fontSize: '0.875rem'
                    }}>
                        <div>
                            <strong>Task ID:</strong> #{task.id}
                        </div>
                        <div>
                            <strong>Created:</strong> {formatDate(task.created_at)}
                        </div>
                    </div>
                </div>
                
                {/* Content */}
                <div style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ 
                            color: '#495057',
                            marginBottom: '0.5rem',
                            fontSize: '1.1rem'
                        }}>
                            📋 Description
                        </h3>
                        <p style={{
                            color: '#6c757d',
                            lineHeight: '1.6',
                            backgroundColor: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '8px',
                            margin: 0
                        }}>
                            {task.description || <em>No description provided</em>}
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div>
                            <h4 style={{ 
                                color: '#6c757d',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                📅 Due Date
                            </h4>
                            <p style={{ 
                                margin: 0,
                                color: '#2c3e50',
                                fontWeight: '600'
                            }}>
                                {formatDate(task.due_date)}
                            </p>
                        </div>
                        
                        <div>
                            <h4 style={{ 
                                color: '#6c757d',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                🔄 Last Updated
                            </h4>
                            <p style={{ 
                                margin: 0,
                                color: '#2c3e50',
                                fontWeight: '600'
                            }}>
                                {formatDate(task.updated_at)}
                            </p>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid #e9ecef'
                    }}>
                        <Link
                            to={`/tasks/${task.id}/edit`}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2980b9';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#3498db';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            ✏️ Edit Task
                        </Link>
                        
                        <Form method="post" action={`/tasks/${task.id}/delete`} style={{ margin: 0 }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#c0392b';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e74c3c';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                                onClick={(e) => {
                                    if (!confirm('Are you sure you want to delete this task?')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                🗑️ Delete Task
                            </button>
                        </Form>
                        
                        <button
                            onClick={() => navigate('/tasks')}
                            style={{
                                marginLeft: 'auto',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                backgroundColor: 'transparent',
                                color: '#6c757d',
                                border: '2px solid #e9ecef',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#dee2e6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = '#e9ecef';
                            }}
                        >
                            ← Back to Tasks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
