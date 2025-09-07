"use client"
import Post from "@/components/posts/Post";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react"; // Import useState and useEffect

// Define a type for your post for better type safety
type PostType = {
    id: number;
    title: string;
    content: string;
    published: boolean;
    authorName?: string | null;
};

function Page() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const { data: session } = useSession(); // Call the hook at the top level

    // Fetch posts when the component mounts or the session changes
    useEffect(() => {
        // You can't use top-level await in useEffect, so we define an async function inside
        const fetchPosts = () => {
            // Simulate fetching data based on the session
            if (session) {
                const fetchedPosts = [{
                    id: 1,
                    title: "title",
                    content: "content here",
                    published: true,
                    authorName: session.user?.email,
                }];
                setPosts(fetchedPosts);
            }
        };

        fetchPosts();
    }, [session]); // The effect depends on the session object

    if (posts.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center">
                <div className="flex flex-col gap-5 items-center m-5">
                    <h1 className="text-3xl font-bold">FEED</h1>
                    <div className="border p-4 mb-4 rounded-lg shadow-md w-full max-w-2xl bg-white">
                        <h2 className="text-2xl font-bold text-gray-800">No Posts Available</h2>
                        <p className="text-gray-600">Login to see your feed or create a new post.</p>
                    </div>
                    <Link href="/add-post" className="border py-2 text-sm hover:bg-white transition-all duration-300 hover:text-black px-4 rounded-2xl">
                        Add Post
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen mt-25 flex flex-col items-center">
            <div className="flex gap-5 justify-center items-center m-5">
                <h1 className="text-3xl font-bold">FEED</h1>
                <Link href="/add-post" className="border py-2 text-sm hover:bg-white transition-all duration-300 hover:text-black px-4 rounded-2xl">
                    Add Post
                </Link>
            </div>
            {posts.map((post) => (
                <div key={post.id} className="w-[30rem]">
                    <Post 
                        id={post.id}
                        title={post.title}
                        content={post.content}
                        published={post.published}
                        authorName={post.authorName ?? "Anonymous"} // Handle potential null authorName
                    />
                </div>
            ))}
        </div>
    )
}

export default Page;