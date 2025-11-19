export default function ResultsView({ options }) {
  const total = options.reduce((sum, o) => sum + o.votes, 0);

  return (
    <ul>
      {options.map((o, i) => (
        <li key={i}>
          {o.text} — {o.votes} votes (
          {total === 0 ? 0 : Math.round((o.votes / total) * 100)}%)
        </li>
      ))}
    </ul>
  );
}
