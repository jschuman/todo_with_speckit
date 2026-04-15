import { AddTodoForm } from "./components/AddTodoForm";
import { FilterBar } from "./components/FilterBar";
import { TodoList } from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";

export function App() {
  const { todos, activeFilter, error, loading, setFilter, addTodo, toggleItem, deleteItem } =
    useTodos();

  return (
    <main>
      <h1>To-Do</h1>
      {error && <p role="alert">{error}</p>}
      <AddTodoForm onAdd={addTodo} />
      <FilterBar activeFilter={activeFilter} onFilterChange={setFilter} />
      {loading ? <p>Loading…</p> : <TodoList items={todos} onToggle={toggleItem} onDelete={deleteItem} />}
    </main>
  );
}
