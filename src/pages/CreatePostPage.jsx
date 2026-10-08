import { useState } from 'react';
import { useCreatePostMutation } from '../features/posts/postApi';
import { useNavigate } from 'react-router-dom';

export default function CreatePostPage() {
  const [createPost, { isLoading, isSuccess, isError, error }] = useCreatePostMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', body: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    else if (form.title.trim().length < 5) errors.title = 'Title must be at least 5 characters';
    
    if (!form.body.trim()) errors.body = 'Body is required';
    else if (form.body.trim().length < 10) errors.body = 'Body must be at least 10 characters';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createPost({ ...form, userId: 1 }).unwrap();
      setSuccessMessage('Post created successfully!');
      setForm({ title: '', body: '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  return (
    <div className="page-container center-container">
      <div className="form-card">
        <h2>Create New Post</h2>
        
        {isSuccess && <div className="alert success-alert">{successMessage}</div>}
        {isError && <div className="alert error-alert">Failed to create post. Please try again.</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className={validationErrors.title ? 'error-input' : ''}
              placeholder="Enter post title"
            />
            {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
          </div>

          <div className="form-group">
            <label>Body</label>
            <textarea 
              value={form.body}
              onChange={(e) => setForm({...form, body: e.target.value})}
              className={validationErrors.body ? 'error-input' : ''}
              placeholder="Write your post content..."
              rows={6}
            />
            {validationErrors.body && <span className="error-text">{validationErrors.body}</span>}
          </div>

          <button type="submit" className="btn primary-btn full-width" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
