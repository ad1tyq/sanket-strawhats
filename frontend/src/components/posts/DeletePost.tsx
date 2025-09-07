"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
interface types {
    postId: number,
}
function DeletePost({ postId }: types) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    async function handleDeletePost() {
        setIsDeleting(true);
        try {
            await fetch(`/api/del-post/${postId}`,
                { method: 'DELETE' }
            );
        } catch (error) {
            console.error(error);
        }
        router.push('/posts');
    }
    return (
        <button onClick={handleDeletePost}
            className="py-2 text-sm font-bold bg-red-400 hover:bg-red-500 cursor-pointer transition-all duration-300 
             px-4 rounded-2xl">{isDeleting ? "Deleting" : "Delete Post" }</button>
    )
}
export default DeletePost;