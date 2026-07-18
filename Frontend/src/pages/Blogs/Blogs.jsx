import { useEffect, useState } from "react";
import {
    getBlogs,
    createBlog,
    deleteBlog,
    likeBlog,
    addComment,
    updateBlog,
} from "../../services/blogService";
import { useAuth } from "../../context/AuthContext";

function Blogs() {
    const { user } = useAuth();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    const [commentTexts, setCommentTexts] =
        useState({});

    const [addingComment, setAddingComment] =
        useState(null);
    const [editingBlog, setEditingBlog] = useState(null);

const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    tags: "",
    coverImage: "",
});

const [updating, setUpdating] = useState(false);
// ================= START EDIT =================

const handleStartEdit = (blog) => {
    setEditingBlog(blog._id);

    setEditFormData({
        title: blog.title || "",
        content: blog.content || "",
        tags: blog.tags?.join(", ") || "",
        coverImage: blog.coverImage || "",
    });
};


// ================= EDIT FORM CHANGE =================

const handleEditChange = (e) => {
    setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value,
    });
};


// ================= UPDATE BLOG =================

const handleUpdateBlog = async (blogId) => {
    try {
        setUpdating(true);

        await updateBlog(blogId, {
            title: editFormData.title,
            content: editFormData.content,

            tags: editFormData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),

            coverImage: editFormData.coverImage,
        });

        setEditingBlog(null);

        await fetchBlogs();

        alert("Blog updated successfully!");

    } catch (error) {
        console.log(error);

        alert(
            error.response?.data?.message ||
            "Unable to update blog"
        );
    } finally {
        setUpdating(false);
    }
};    

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: "",
        coverImage: "",
    });


    // ================= FETCH BLOGS =================

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const res = await getBlogs();

            setBlogs(res.data.blogs || []);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };


    // ================= FORM CHANGE =================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    // ================= CREATE BLOG =================

    const handleCreateBlog = async (e) => {
        e.preventDefault();

        try {
            setCreating(true);

            await createBlog({
                title: formData.title,

                content: formData.content,

                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),

                coverImage:
                    formData.coverImage,
            });

            setFormData({
                title: "",
                content: "",
                tags: "",
                coverImage: "",
            });

            setShowCreateForm(false);

            await fetchBlogs();

            alert(
                "Blog published successfully!"
            );

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                    "Unable to publish blog"
            );

        } finally {
            setCreating(false);
        }
    };


    // ================= DELETE BLOG =================

    const handleDelete = async (id) => {
        const ok = window.confirm(
            "Delete this blog?"
        );

        if (!ok) return;

        try {
            await deleteBlog(id);

            await fetchBlogs();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                    "Unable to delete blog"
            );
        }
    };


    // ================= LIKE BLOG =================

    const handleLike = async (id) => {
        try {
            await likeBlog(id);

            await fetchBlogs();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                    "Unable to like blog"
            );
        }
    };


    // ================= ADD COMMENT =================

    const handleAddComment = async (
        blogId
    ) => {
        const text =
            commentTexts[blogId]?.trim();

        if (!text) {
            alert(
                "Please write a comment."
            );
            return;
        }

        try {
            setAddingComment(blogId);

            await addComment(blogId, {
                text,
            });

            setCommentTexts((prev) => ({
                ...prev,
                [blogId]: "",
            }));

            await fetchBlogs();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                    "Unable to add comment"
            );

        } finally {
            setAddingComment(null);
        }
    };


    // ================= LOADING =================

    if (loading) {
        return (
            <div className="text-center text-xl font-semibold mt-10">
                Loading blogs...
            </div>
        );
    }


    return (

        <div className="max-w-6xl mx-auto space-y-8">


            {/* ================= HEADER ================= */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Developer Blogs
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Share your knowledge and learn
                        from other developers.
                    </p>

                </div>


                <button
                    onClick={() =>
                        setShowCreateForm(
                            !showCreateForm
                        )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
                >
                    {showCreateForm
                        ? "Cancel"
                        : "+ Write Blog"}
                </button>

            </div>


            {/* ================= CREATE BLOG ================= */}

            {showCreateForm && (

                <div className="bg-white rounded-2xl shadow p-6">

                    <h2 className="text-2xl font-bold mb-5">
                        Write a New Blog
                    </h2>


                    <form
                        onSubmit={
                            handleCreateBlog
                        }
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Blog Title"
                            value={
                                formData.title
                            }
                            onChange={
                                handleChange
                            }
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />


                        <textarea
                            name="content"
                            placeholder="Write your blog..."
                            rows="8"
                            value={
                                formData.content
                            }
                            onChange={
                                handleChange
                            }
                            required
                            className="w-full border rounded-lg px-4 py-3"
                        />


                        <input
                            type="text"
                            name="tags"
                            placeholder="Tags: React, JavaScript, Node.js"
                            value={
                                formData.tags
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full border rounded-lg px-4 py-3"
                        />


                        <input
                            type="url"
                            name="coverImage"
                            placeholder="Cover Image URL (optional)"
                            value={
                                formData.coverImage
                            }
                            onChange={
                                handleChange
                            }
                            className="w-full border rounded-lg px-4 py-3"
                        />


                        <button
                            type="submit"
                            disabled={creating}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                        >
                            {creating
                                ? "Publishing..."
                                : "Publish Blog"}
                        </button>

                    </form>

                </div>

            )}


            {/* ================= BLOG FEED ================= */}

            {blogs.length === 0 ? (

                <div className="bg-white rounded-2xl shadow p-10 text-center">

                    <h2 className="text-2xl font-bold">
                        No Blogs Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Be the first developer to
                        publish a blog.
                    </p>

                </div>

            ) : (

                <div className="space-y-6">

                    {blogs.map((blog) => {

                        const authorId =
                            blog.author?._id ||
                            blog.author;

                        const isAuthor =
                            authorId?.toString() ===
                            user?._id?.toString();


                        const hasLiked =
                            blog.likes?.some(
                                (id) =>
                                    (
                                        id?._id ||
                                        id
                                    )?.toString() ===
                                    user?._id?.toString()
                            );


                        return (

                            <div
                                key={blog._id}
                                className="bg-white rounded-2xl shadow overflow-hidden"
                            >


                                {/* COVER IMAGE */}

                                {blog.coverImage && (

                                    <img
                                        src={
                                            blog.coverImage
                                        }
                                        alt={
                                            blog.title
                                        }
                                        className="w-full h-64 object-cover"
                                    />

                                )}


                                <div className="p-6">


                                    {/* AUTHOR */}

                                    <div className="flex justify-between items-start gap-4">


                                        <div className="flex items-center gap-3">

                                            <img
                                                src={
                                                    blog
                                                        .author
                                                        ?.photoUrl ||
                                                    "https://ui-avatars.com/api/?name=Developer"
                                                }
                                                alt="Author"
                                                className="w-11 h-11 rounded-full object-cover border"
                                            />


                                            <div>

                                                <p className="font-semibold">
                                                    {
                                                        blog
                                                            .author
                                                            ?.firstName
                                                    }{" "}
                                                    {
                                                        blog
                                                            .author
                                                            ?.lastName
                                                    }
                                                </p>


                                                <p className="text-xs text-gray-500">

                                                    {blog.createdAt
                                                        ? new Date(
                                                              blog.createdAt
                                                          ).toLocaleDateString()
                                                        : ""}

                                                </p>

                                            </div>

                                        </div>


                                        {/* DELETE */}

                                        {/* EDIT + DELETE */}

{isAuthor && (
    <div className="flex gap-2">

        <button
            onClick={() =>
                handleStartEdit(blog)
            }
            className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg font-semibold"
        >
            Edit
        </button>

        <button
            onClick={() =>
                handleDelete(blog._id)
            }
            className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-semibold"
        >
            Delete
        </button>

    </div>
)}

                                          

                                    </div>


                                    {/* BLOG CONTENT */}

                                   {/* BLOG CONTENT / EDIT FORM */}

{editingBlog === blog._id ? (

    <div className="mt-5 space-y-4">

        <input
            type="text"
            name="title"
            value={editFormData.title}
            onChange={handleEditChange}
            className="w-full border rounded-lg px-4 py-3"
        />

        <textarea
            name="content"
            rows="7"
            value={editFormData.content}
            onChange={handleEditChange}
            className="w-full border rounded-lg px-4 py-3"
        />

        <input
            type="text"
            name="tags"
            value={editFormData.tags}
            onChange={handleEditChange}
            placeholder="React, Node.js, MongoDB"
            className="w-full border rounded-lg px-4 py-3"
        />

        <input
            type="url"
            name="coverImage"
            value={editFormData.coverImage}
            onChange={handleEditChange}
            placeholder="Cover Image URL"
            className="w-full border rounded-lg px-4 py-3"
        />

        <div className="flex gap-3">

            <button
                onClick={() =>
                    handleUpdateBlog(blog._id)
                }
                disabled={updating}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
                {updating
                    ? "Updating..."
                    : "Update Blog"}
            </button>

            <button
                onClick={() =>
                    setEditingBlog(null)
                }
                className="border px-5 py-2 rounded-lg font-semibold"
            >
                Cancel
            </button>

        </div>

    </div>

) : (
    <>
        <h2 className="text-2xl font-bold mt-5">
            {blog.title}
        </h2>

        <p className="text-gray-600 mt-3 whitespace-pre-line">
            {blog.content}
        </p>
    </>
)}


                                    {/* TAGS */}

                                    {blog.tags?.length >
                                        0 && (

                                        <div className="flex flex-wrap gap-2 mt-5">

                                            {blog.tags.map(
                                                (
                                                    tag,
                                                    index
                                                ) => (

                                                    <span
                                                        key={
                                                            index
                                                        }
                                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        #
                                                        {
                                                            tag
                                                        }
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    )}


                                    {/* LIKE */}

                                    <div className="mt-6 pt-4 border-t">

                                        <button
                                            onClick={() =>
                                                handleLike(
                                                    blog._id
                                                )
                                            }
                                            className={`px-4 py-2 rounded-lg font-semibold ${
                                                hasLiked
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >

                                            {hasLiked
                                                ? "♥ Liked"
                                                : "♡ Like"}{" "}

                                            (
                                            {blog.likes
                                                ?.length ||
                                                0}
                                            )

                                        </button>


                                        <span className="ml-4 text-gray-500 text-sm">

                                            {blog.comments
                                                ?.length ||
                                                0}{" "}
                                            Comments

                                        </span>

                                    </div>


                                    {/* ================= COMMENTS ================= */}

                                    <div className="mt-5 pt-5 border-t">

                                        <h3 className="font-bold text-lg">
                                            Comments
                                        </h3>


                                        {/* ADD COMMENT */}

                                        <div className="flex gap-3 mt-4">

                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={
                                                    commentTexts[
                                                        blog
                                                            ._id
                                                    ] ||
                                                    ""
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setCommentTexts(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            [blog._id]:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="flex-1 border rounded-lg px-4 py-2"
                                            />


                                            <button
                                                onClick={() =>
                                                    handleAddComment(
                                                        blog._id
                                                    )
                                                }
                                                disabled={
                                                    addingComment ===
                                                    blog._id
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                                            >

                                                {addingComment ===
                                                blog._id
                                                    ? "Posting..."
                                                    : "Comment"}

                                            </button>

                                        </div>


                                        {/* COMMENT LIST */}

                                        {!blog.comments ||
                                        blog.comments
                                            .length ===
                                            0 ? (

                                            <p className="text-gray-500 text-sm mt-4">
                                                No comments
                                                yet.
                                            </p>

                                        ) : (

                                            <div className="space-y-3 mt-4">

                                                {blog.comments.map(
                                                    (
                                                        comment,
                                                        index
                                                    ) => (

                                                        <div
    key={comment._id || index}
    className="bg-gray-50 rounded-lg p-3"
>
    <div className="flex items-start gap-3">

        <img
            src={
                comment.user?.photoUrl ||
                "https://ui-avatars.com/api/?name=Developer"
            }
            alt="Developer"
            className="w-9 h-9 rounded-full object-cover border"
        />

        <div className="flex-1">

            <p className="font-semibold text-sm text-gray-900">
                {comment.user?.firstName || "Developer"}{" "}
                {comment.user?.lastName || ""}
            </p>

            <p className="text-gray-700 mt-1">
                {comment.text}
            </p>

            {comment.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                    {new Date(
                        comment.createdAt
                    ).toLocaleDateString()}
                </p>
            )}

        </div>

    </div>
</div>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

            )}

        </div>

    );
}

export default Blogs;