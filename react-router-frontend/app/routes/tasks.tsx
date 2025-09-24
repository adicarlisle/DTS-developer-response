import { Link, useLoaderData, Form } from "react-router";

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
    try {
        const response = await fetch('http://localhost:8000/tasks');
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
    
    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'todo': return '#ffc107';
            case 'in_progress': return '#17a2b8';
            case 'completed': return '#28a745';
            case 'cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };
    
    return (
        <div>
            <h1>Tasks</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            padding: '1rem',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h3>{task.title}</h3>
                        {task.description && <p style={{ color: '#666' }}>{task.description}</p>}
                        <div style={{ 
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: getStatusColor(task.status),
                            color: 'white',
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem'
                        }}>
                            {task.status.replace('_', ' ').toUpperCase()}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                        </p>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <Link 
                                to={`/tasks/${task.id}/edit`}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Edit
                            </Link>
                            <Form 
                                method="post" 
                                action={`/tasks/${task.id}/delete`}
                                style={{ margin: 0 }}
                                onSubmit={(e) => {
                                    if (!confirm('Are you sure you want to delete this task?')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </Form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}