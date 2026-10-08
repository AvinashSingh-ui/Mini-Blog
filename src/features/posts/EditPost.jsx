import { useState } from "react";
import { useEditPostMutation } from "./postApi";

function EditPost({ post }) {
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const [editPost, { isLoading, isSuccess, isError }] =
    useEditPostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await editPost({
      id: post.id,
      title,
      body,
      userId: post.userId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Post"}
      </button>

      {isSuccess && <p>Post updated successfully.</p>}
      {isError && <p>Failed to update post.</p>}
    </form>
  );
}

export default EditPost;