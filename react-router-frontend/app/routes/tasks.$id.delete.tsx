import { redirect } from "react-router";

export async function action({ params }: { params: { id: string } }) {
    const apiUrl = process.env.API_URL || 'http://localhost:8000';
    try {
        const response = await fetch(`${apiUrl}/tasks/${params.id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
            return redirect("/tasks?message=Task delete failed");
        }
        return redirect("/?message=Task deleted successfully");
        return redirect('/tasks');
    } catch (error) {
        console.error('Failed to delete task:', error);
        throw new Response("Failed to delete task", { status: 500 });
        return redirect("/?message=Network error - could not delete task");
    }
}