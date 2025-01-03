import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator()

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  const deleteTodo = (id: string) => {
    client.models.Todo.delete({ id })
  }

  console.log(todos)

  return (
    <main>
        <div className="">
          <button onClick={signOut}>Log out</button>
        </div>
      <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
        <h1>My todos</h1>
      </div>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <div key={todo.id} style={{ display: "flex", minWidth: "500px", justifyContent: "space-between", alignItems: "center", gap: '20px' }}>
            <li style={{ flex: 1 }}>{todo.content}</li>
            <span style={{color: "white", textAlign: "center", display: "block"}}>{todo.isDone ? "Complete" : "Pending"}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </ul>
      {/* <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div> */}
    </main>
  );
}

export default App;
