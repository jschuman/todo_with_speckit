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
    <form onSubmit={(e) => void handleSubmit(e)}>
      <label>
        Title
        <input aria-label="Title" ref={titleRef} type="text" />
      </label>
      <label>
        Description
        <input aria-label="Description" ref={descRef} type="text" />
      </label>
      {validationError && <p role="alert">{validationError}</p>}
      <button type="submit">Add</button>
    </form>
  );
}
