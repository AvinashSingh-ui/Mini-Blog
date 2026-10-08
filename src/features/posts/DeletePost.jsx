import { useDeletePostMutation } from "./postApi";

function DeletePost({ postId }) {
  const [deletePost, { isLoading, isSuccess, isError }] =
    useDeletePostMutation();

  const handleDelete = async () => {
    await deletePost(postId);
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={isLoading}>
        {isLoading ? "Deleting..." : "Delete Post"}
      </button>

      {isSuccess && <p>Post deleted successfully.</p>}
      {isError && <p>Failed to delete post.</p>}
    </div>
  );
}

export default DeletePost;