import { Form, redirect, useActionData, useNavigate } from "react-router";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const taskData = Object.fromEntries(formData);
    const apiUrl = process.env.API_URL || 'http://localhost:8000';
    
    try {
        const response = await fetch(`${apiUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        
        const newTask = await response.json();
        return redirect(`/tasks/${newTask.id}`);
    } catch (error) {
        console.error('Failed to create task:', error);
        throw new Response("Failed to create task", { status: 500 });
    }
}

export default function NewTask() {
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    
    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '2rem'
            }}>
                <h1 style={{ 
                    marginTop: 0,
                    marginBottom: '1.5rem',
                    color: '#2c3e50',
                    fontSize: '2rem'
                }}>
                    ✨ Create New Task
                </h1>
                
                {actionData?.error && (
                    <div style={{
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        color: '#c33',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem'
                    }}>
                        {actionData.error}
                    </div>
                )}
                
                <Form method="post">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#555',
                            fontWeight: '600'
                        }}>
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="Enter task title..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '2px solid #e0e0e0',
                                fontSize: '1rem',
                                transition: 'border-color 0.3s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#555',
                            fontWeight: '600'
                        }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Add task details..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '2px solid #e0e0e0',
                                fontSize: '1rem',
                                transition: 'border-color 0.3s',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#555',
                            fontWeight: '600'
                        }}>
                            Status
                        </label>
                        <select
                            name="status"
                            defaultValue="todo"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '2px solid #e0e0e0',
                                fontSize: '1rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        >
                            <option value="todo">📝 To Do</option>
                            <option value="in_progress">🔄 In Progress</option>
                            <option value="completed">✅ Completed</option>
                            <option value="cancelled">❌ Cancelled</option>
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#555',
                            fontWeight: '600'
                        }}>
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            name="due_date"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                border: '2px solid #e0e0e0',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3498db'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem',
                        justifyContent: 'flex-end' 
                    }}>
                        <button
                            type="button"
                            onClick={() => navigate('/tasks')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '6px',
                                border: '2px solid #e0e0e0',
                                backgroundColor: 'white',
                                color: '#666',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8f8f8';
                                e.currentTarget.style.borderColor = '#ccc';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e0e0e0';
                            }}
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 2rem',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#3498db',
                                color: 'white',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.3s',
                                boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2980b9';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#3498db';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(52, 152, 219, 0.3)';
                            }}
                        >
                            Create Task
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}