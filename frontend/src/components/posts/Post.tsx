
import DeletePost from "./DeletePost";
interface types {
    id: number;
    title: string; 
    content: string | null;
    published: boolean; 
    authorName: string | null;
}

function Post({ id, title, content, published, authorName }: types) {
    return (
        <div key={id} className="border p-4 mb-4 rounded-lg shadow-md w-full max-w-2xl bg-white">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 text-sm mb-2">By: {authorName ?? 'Unknown Author'}</p>
            <p className="text-gray-700 my-2">{content}</p>
            <p className={`text-sm font-medium ${published ? 'text-green-600' : 'text-red-600'}`}>
                Status: {published ? 'Published' : 'Draft'}
            </p>
            <div className="mt-2 flex justify-center">
                <DeletePost postId={id}/>
            </div>
        </div>
    )
}
export default Post;