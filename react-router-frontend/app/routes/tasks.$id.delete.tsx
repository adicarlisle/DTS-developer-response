import { redirect } from "react-router";

export async function action({ params }: { params: { id: string } }) {
    try {
        const response = await fetch(`http://localhost:8000/tasks/${params.id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        return redirect('/tasks');
    } catch (error) {
        console.error('Failed to delete task:', error);
        throw new Response("Failed to delete task", { status: 500 });
    }
}