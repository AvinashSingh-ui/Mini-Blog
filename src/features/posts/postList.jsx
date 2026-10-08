import { useGetPostsQuery } from "./postApi";


function PostList() {
  const { data, isLoading, isError, error } = useGetPostsQuery();

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (isError) {
    return <p>Failed to load posts.</p>;
  }

  return (
    <div>
      <h2>All Posts</h2>

      {data?.map((post) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}

export default PostList;