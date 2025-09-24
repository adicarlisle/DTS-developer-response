import { Form, redirect } from "react-router";

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const taskData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('http://localhost:8000/tasks', {
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
    return (
        <div>
            <h1>Create New Task</h1>
            <Form method="post">
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select id="status" name="status">
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="due_date">Due Date:</label>
                    <input type="datetime-local" id="due_date" name="due_date" required />
                </div>
                <button type="submit">Create Task</button>
            </Form>
        </div>
    );
}