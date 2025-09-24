import { Form, redirect, useLoaderData } from "react-router";

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: "todo" | "in_progress" | "completed" | "cancelled";
    due_date: string;
}

export async function loader({ params }: { params: { id: string } }) {
    const apiUrl = process.env.API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/tasks/${params.id}`);
    if (!response.ok) {
        throw new Response("Task not found", { status: 404 });
    }
    return response.json();
}

export async function action({ request, params }: { request: Request, params: { id: string } }) {
    const apiUrl = process.env.API_URL || 'http://localhost:8000';
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    try {
        const response = await fetch(`${apiUrl}/tasks/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        
        return redirect(`/tasks/${params.id}`);
    } catch (error) {
        console.error('Failed to update task:', error);
        throw new Response("Failed to update task", { status: 500 });
    }
}

export default function EditTask() {
    const task = useLoaderData() as Task;
    
    return (
        <div>
            <h1>Edit Task</h1>
            <Form method="post">
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" defaultValue={task.title} required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" defaultValue={task.description || ''} />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select id="status" name="status" defaultValue={task.status}>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="due_date">Due Date:</label>
                    <input 
                        type="datetime-local" 
                        id="due_date" 
                        name="due_date" 
                        defaultValue={task.due_date.slice(0, 16)} 
                        required 
                    />
                </div>
                <button type="submit">Update Task</button>
            </Form>
        </div>
    );
}