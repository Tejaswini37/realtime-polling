import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { request } from "./api";
import ResultsView from "./ResultsView";

export default function PollDetail() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);

  const load = () => request(`/polls/${id}`).then(setPoll);

  useEffect(() => {
    load();
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [id]);

  const vote = async (i) => {
    await request(`/polls/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ optionIndex: i }),
    });
    setVoted(true);
    load();
  };

  if (!poll) return <p>Loading...</p>;

  return (
    <div>
      <h2>{poll.question}</h2>

      {!voted
        ? poll.options.map((opt, i) => (
            <button key={i} onClick={() => vote(i)}>
              {opt.text}
            </button>
          ))
        : <ResultsView options={poll.options} />}
    </div>
  );
}
