import useAxios from "../hooks/useAxios";

function WithCustomHook() {
  const {
    data: posts,
    loading,
    error,
    refetch,
  } = useAxios("https://jsonplaceholder.typicode.com/posts?_limit=5");

  if (loading) return <h2>Loading data...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Data Posts Menggunakan Custom Hook</h1>

      <button onClick={refetch}>Refresh Data</button>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default WithCustomHook;