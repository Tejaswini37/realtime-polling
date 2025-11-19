import { Routes, Route, Link } from "react-router-dom";
import PollList from "./PollList";
import PollCreate from "./PollCreate";
import PollDetail from "./PollDetail";

export default function App() {
  return (
    <div className="container">
      <h1>Real-Time Polling</h1>
      <nav>
        <Link to="/">Polls</Link> | <Link to="/create">Create</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PollList />} />
        <Route path="/create" element={<PollCreate />} />
        <Route path="/polls/:id" element={<PollDetail />} />
      </Routes>
    </div>
  );
}
