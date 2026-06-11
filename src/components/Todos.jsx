import { useState, useEffect } from "react";
import axios from "axios";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos?_limit=20"
        );

        setTodos(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const getFilteredTodos = () => {
    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    if (filter === "pending") {
      return todos.filter((todo) => !todo.completed);
    }

    return todos;
  };

  const filteredTodos = getFilteredTodos();

  if (loading) return <h2>Loading todos...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo List</h1>

      <button onClick={() => setFilter("all")}>
        Semua
      </button>

      <button onClick={() => setFilter("completed")}>
        Selesai
      </button>

      <button onClick={() => setFilter("pending")}>
        Pending
      </button>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            {todo.completed ? "✅" : "❌"} {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;