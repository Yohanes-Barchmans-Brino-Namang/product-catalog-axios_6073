import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [postsRes, usersRes, commentsRes] = await Promise.all([
          axios.get("https://jsonplaceholder.typicode.com/posts?_limit=10"),
          axios.get("https://jsonplaceholder.typicode.com/users"),
          axios.get("https://jsonplaceholder.typicode.com/comments?_limit=10"),
        ]);

        setPosts(postsRes.data);
        setUsers(usersRes.data);
        setComments(commentsRes.data);
        setError(null);
      } catch (err) {
        setError("Gagal mengambil data dari API");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <h2>Loading dashboard...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard API</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h2>{posts.length}</h2>
          <p>Posts</p>
        </div>

        <div style={cardStyle}>
          <h2>{users.length}</h2>
          <p>Users</p>
        </div>

        <div style={cardStyle}>
          <h2>{comments.length}</h2>
          <p>Comments</p>
        </div>
      </div>

      <h2>Daftar Posts</h2>
      {posts.map((post) => (
        <div key={post.id} style={listStyle}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "20px",
  borderRadius: "8px",
  width: "150px",
  textAlign: "center",
  backgroundColor: "#f5f5f5",
};

const listStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
};

export default Dashboard;