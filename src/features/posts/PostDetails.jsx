import {
  useGetCommentsQuery,
  useGetPostByIdQuery,
} from "./postApi";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";

function PostDetails({ postId }) {
  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = useGetPostByIdQuery(postId);

  const {
    data: comments,
    isLoading: commentsLoading,
  } = useGetCommentsQuery(postId);

  console.log(post, comments);

  if (postLoading || commentsLoading) {
    return <div>Loading...</div>;
  }

  if (postError) {
    return <p>Failed to load post.</p>;
  }

  return (
    <article>
      <h2>{post?.title}</h2>
      <p>{post?.body}</p>

      <EditPost post={post}/>
      <h3>Comments</h3>
    <DeletePost postId={post.id}/>
      {comments?.map((comment) => (
        <div key={comment.id}>
          <strong>{comment.name}</strong>
          <p>{comment.body}</p>
        </div>
      ))}
    </article>
  );
}

export default PostDetails;