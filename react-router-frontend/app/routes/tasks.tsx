import { Link, useLoaderData, useSearchParams } from "react-router";

type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    due_date: string;
    created_at: string;
    updated_at: string;
}

export async function loader() {
    const apiUrl = process.env.API_URL || 'http://localhost:8000';
    try {
        const response = await fetch(`${apiUrl}/tasks`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks: Task[] = await response.json();
        return tasks;
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        throw new Response("Failed to load tasks", { status: 500 });
    }
}

export default function Tasks() {
    const tasks = useLoaderData() as Task[];
    const [searchParams] = useSearchParams();
    const message = searchParams.get("message");
    
    const getStatusStyle = (status: string) => {
        const styles: Record<string, { bg: string; color: string; icon: string }> = {
            todo: { bg: '#e3f2fd', color: '#1976d2', icon: '📝' },
            in_progress: { bg: '#fff3e0', color: '#f57c00', icon: '🔄' },
            completed: { bg: '#e8f5e9', color: '#388e3c', icon: '✅' },
            cancelled: { bg: '#ffebee', color: '#d32f2f', icon: '❌' }
        };
        return styles[status] || styles.todo;
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    const getDueDateStyle = (dueDate: string) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { color: '#dc3545', text: 'Overdue' };
        if (diffDays === 0) return { color: '#ff6b6b', text: 'Due Today' };
        if (diffDays <= 3) return { color: '#ffc107', text: `${diffDays} days left` };
        return { color: '#6c757d', text: formatDate(dueDate) };
    };
    
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {message && (
                <div style={{ 
                    backgroundColor: '#d4edda', 
                    border: '1px solid #c3e6cb',
                    color: '#155724',
                    padding: '12px', 
                    marginBottom: '1rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    ✅ {message}
                </div>
            )}
            
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem' 
            }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>📋 My Tasks</h1>
                <span style={{ color: '#6c757d' }}>{tasks.length} tasks total</span>
            </div>
            
            <div style={{ 
                display: 'grid', 
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
            }}>
                {tasks.map((task) => {
                    const statusStyle = getStatusStyle(task.status);
                    const dueDateInfo = getDueDateStyle(task.due_date);
                    
                    return (
                        <Link
                            key={task.id}
                            to={`/tasks/${task.id}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                padding: '1.5rem',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                                border: '1px solid #e9ecef',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
                                e.currentTarget.style.borderColor = '#3498db';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
                                e.currentTarget.style.borderColor = '#e9ecef';
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <h3 style={{ 
                                        margin: 0,
                                        color: '#2c3e50',
                                        fontSize: '1.25rem',
                                        flex: 1,
                                        marginRight: '1rem'
                                    }}>
                                        {task.title}
                                    </h3>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '15px',
                                        backgroundColor: statusStyle.bg,
                                        color: statusStyle.color,
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {statusStyle.icon} {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                {task.description && (
                                    <p style={{
                                        color: '#6c757d',
                                        margin: '0 0 1rem 0',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.4',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {task.description}
                                    </p>
                                )}
                                
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 'auto',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #f0f0f0',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ 
                                        color: '#6c757d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        🆔 #{task.id}
                                    </span>
                                    <span style={{ 
                                        color: dueDateInfo.color,
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        📅 {dueDateInfo.text}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            
            {tasks.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px'
                }}>
                    <h2 style={{ color: '#6c757d', marginBottom: '1rem' }}>No tasks yet!</h2>
                    <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
                        Create your first task to get started.
                    </p>
                    <Link
                        to="/tasks/new"
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#3498db',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            display: 'inline-block',
                            fontWeight: '500'
                        }}
                    >
                        ➕ Create New Task
                    </Link>
                </div>
            )}
        </div>
    );
}