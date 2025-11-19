import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "./api";

export default function PollList() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    request("/polls").then(setPolls);
  }, []);

  return (
    <div>
      <h2>All Polls</h2>
      <ul>
        {polls.map((p) => (
          <li key={p.id}>
            <Link to={`/polls/${p.id}`}>{p.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
