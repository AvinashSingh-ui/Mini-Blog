import { useState } from "react";
import { useCreatePostMutation } from "./postApi";


function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [createPost, { isLoading, isError, isSuccess }] =
    useCreatePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

  const result= await createPost({
      title,
      body,
      userId: 1,
    });
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post content"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </button>

      {isSuccess && <p>Post created successfully.</p>}
      {isError && <p>Failed to create post.</p>}
    </form>
  );
}

export default CreatePost;