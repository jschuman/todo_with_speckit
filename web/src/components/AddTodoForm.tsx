import "./AddTodoForm.css";
import { useRef, useState } from "react";

interface Props {
  onAdd: (title: string, description: string | null) => Promise<void>;
}

export function AddTodoForm({ onAdd }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = titleRef.current?.value.trim() ?? "";
    if (!title) {
      setValidationError("Title is required");
      return;
    }
    setValidationError(null);
    const desc = descRef.current?.value.trim() || null;
    await onAdd(title, desc);
    if (titleRef.current) titleRef.current.value = "";
    if (descRef.current) descRef.current.value = "";
  }

  return (
    <form className="form-card" onSubmit={(e) => void handleSubmit(e)}>
      <div className="form-group">
        <label>
          Title
          <input aria-label="Title" ref={titleRef} type="text" />
        </label>
      </div>
      <div className="form-group">
        <label>
          Description
          <input aria-label="Description" ref={descRef} type="text" />
        </label>
      </div>
      {validationError && <p role="alert" className="form-error">{validationError}</p>}
      <button type="submit" className="btn btn-primary">Add</button>
    </form>
  );
}
