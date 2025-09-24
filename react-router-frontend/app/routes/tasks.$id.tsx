import { useLoaderData, useParams } from "react-router";

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
    try {
        const response = await fetch(`http://localhost:8000/tasks/${params.id}`);
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
    
    return (
        <div>
            <h1>{task.title}</h1>
            {task.description && <p>{task.description}</p>}
            <p>Status: {task.status.replace('_', ' ')}</p>
            <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
            <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
            <p>Updated: {new Date(task.updated_at).toLocaleDateString()}</p>
        </div>
    );
}