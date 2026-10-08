import { useState } from 'react';
import { useGetPostsQuery } from '../features/posts/postApi';
import { Link } from 'react-router-dom';
import { PostCardSkeleton } from '../components/ui/Skeletons';
import { ErrorState } from '../components/ui/ErrorState';
import { Search } from 'lucide-react';

export default function Home() {
  const { data: posts, isLoading, isError, refetch } = useGetPostsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="home-page">
        <section className="hero">
          <h1>Welcome to Mini Blog</h1>
          <p>Discover amazing stories and ideas.</p>
        </section>
        <div className="posts-grid">
          {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to Mini Blog</h1>
        <p>Discover amazing stories and ideas.</p>
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search posts by title or content..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </section>

      <section className="posts-section">
        {filteredPosts?.length === 0 ? (
          <div className="empty-state">
            <p>No posts found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts?.map(post => (
              <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.body.substring(0, 100)}...</p>
                <div className="post-footer">
                  <span className="user-id">User ID: {post.userId}</span>
                  <Link to={`/posts/${post.id}`} className="read-more-btn">Read More</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
