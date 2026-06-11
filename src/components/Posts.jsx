import { useState, useEffect } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal mengambil data posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <h2>Loading posts...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Daftar Posts</h1>
      <p>Total posts: {posts.length}</p>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px'
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <small>User ID: {post.userId} | Post ID: {post.id}</small>
        </div>
      ))}
    </div>
  );
}

export default Posts;