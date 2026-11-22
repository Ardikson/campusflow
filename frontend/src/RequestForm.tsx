import { useState } from "react";
import type { SubmitEvent } from "react";

export type NewRequestData = {
  title: string;
  student: string;
  room: string;
  category: string;
};

type RequestFormProps = {
  onCreate: (data: NewRequestData) => void;
  onCancel: () => void;
};

function RequestForm({ onCreate, onCancel }: RequestFormProps) {
  const [title, setTitle] = useState("");
  const [student, setStudent] = useState("");
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [error, setError] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const data: NewRequestData = {
      title: title.trim(),
      student: student.trim(),
      room: room.trim(),
      category,
    };

    if (!data.title || !data.student || !data.room) {
      setError("Please complete all required fields.");
      return;
    }

    if (data.title.length < 5) {
      setError("The request title must contain at least 5 characters.");
      return;
    }

    onCreate(data);
  }

  return (
    <section className="request-form-panel" aria-labelledby="new-request-title">
      <div className="form-heading">
        <div>
          <h2 id="new-request-title">Create a request</h2>
          <p>Use fictional information for this demo.</p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field full-width">
            <label htmlFor="new-title">Request title *</label>
            <input
              id="new-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="For example: The desk chair is broken"
              minLength={5}
              maxLength={120}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="new-student">Student name *</label>
            <input
              id="new-student"
              value={student}
              onChange={(event) => setStudent(event.target.value)}
              placeholder="Alex Morgan"
              maxLength={80}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="new-room">Room *</label>
            <input
              id="new-room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              placeholder="204"
              maxLength={20}
              required
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="new-category">Category</label>
            <select
              id="new-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Internet">Internet</option>
              <option value="Housing">Housing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button className="primary-button" type="submit">
            Create request
          </button>
        </div>
      </form>
    </section>
  );
}

export default RequestForm;