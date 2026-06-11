import { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal mengambil data users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <h2>Loading users...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Daftar Pengguna</h1>
      <p>Total users: {users.length}</p>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px'
          }}
        >
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
          <p>Company: {user.company.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Users;