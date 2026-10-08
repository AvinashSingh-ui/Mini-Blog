import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  useGetPostByIdQuery, 
  useGetCommentsQuery, 
  useEditPostMutation, 
  useDeletePostMutation 
} from '../features/posts/postApi';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { PostDetailsSkeleton } from '../components/ui/Skeletons';
import { ErrorState } from '../components/ui/ErrorState';

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading, isError, refetch } = useGetPostByIdQuery(id);
  const { data: comments, isLoading: isLoadingComments } = useGetCommentsQuery(id);
  
  const [editPost, { isLoading: isEditing }] = useEditPostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', body: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) return <div className="page-container"><PostDetailsSkeleton /></div>;
  if (isError) return <div className="page-container"><ErrorState onRetry={refetch} /></div>;

  const handleEditClick = () => {
    setEditForm({ title: post.title, body: post.body });
    setIsEditMode(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await editPost({ id, ...editForm }).unwrap();
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to update post', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to Posts
      </Link>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Post?</h3>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn outline-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn danger-btn" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="post-details">
        {isEditMode ? (
          <form className="edit-form" onSubmit={handleUpdate}>
            <input 
              type="text" 
              value={editForm.title}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              required
            />
            <textarea 
              value={editForm.body}
              onChange={(e) => setEditForm({...editForm, body: e.target.value})}
              required
              rows={5}
            />
            <div className="form-actions">
              <button type="button" className="btn outline-btn" onClick={() => setIsEditMode(false)}>Cancel</button>
              <button type="submit" className="btn primary-btn" disabled={isEditing}>
                {isEditing ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1>{post.title}</h1>
            <p className="post-body-large">{post.body}</p>
            <div className="post-meta">Author / User ID: {post.userId}</div>
            
            <div className="post-actions">
              <button className="btn outline-btn" onClick={handleEditClick}>
                <Edit2 size={16} /> Edit Post
              </button>
              <button className="btn danger-btn" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={16} /> Delete Post
              </button>
            </div>
          </>
        )}

        <hr className="divider" />
        
        <div className="comments-section">
          <h2>Comments</h2>
          {isLoadingComments ? (
            <p>Loading comments...</p>
          ) : comments?.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="comments-list">
              {comments?.map(comment => (
                <div key={comment.id} className="comment-card">
                  <h4>{comment.name}</h4>
                  <span className="comment-email">{comment.email}</span>
                  <p>{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
