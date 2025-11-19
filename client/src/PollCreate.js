import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "./api";

export default function PollCreate() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const navigate = useNavigate();

  const addOption = () => setOptions([...options, ""]);
  const remove = (i) =>
    setOptions(options.filter((_, idx) => idx !== i));

  async function submit(e) {
    e.preventDefault();
    const poll = await request("/polls", {
      method: "POST",
      body: JSON.stringify({ question, options }),
    });

    navigate(`/polls/${poll._id || poll.id}`);
  }

  return (
    <form onSubmit={submit}>
      <h2>Create Poll</h2>

      <input
        placeholder="Poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <h3>Options</h3>
      {options.map((opt, i) => (
        <div key={i}>
          <input
            value={opt}
            onChange={(e) =>
              setOptions(options.map((o, idx) => (idx === i ? e.target.value : o)))
            }
          />
          {options.length > 2 && (
            <button type="button" onClick={() => remove(i)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addOption}>
        Add Option
      </button>
      <button type="submit">Create</button>
    </form>
  );
}
