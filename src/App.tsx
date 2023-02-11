import { useMachine } from "@xstate/react";
import "./App.css";
import { redditMachince } from "./redditMachine";

const subreddits = ["frontend", "reactjs", "vuejs", "laravel"];

function App() {
  const [current, send] = useMachine(redditMachince);
  const { subreddit, posts } = current.context;

  return (
    <div className="App">
      <header>
        <select
          onChange={(e) => {
            send({ type: "SELECT", name: e.target.value });
          }}
        >
          {subreddits.map((subreddit) => (
            <option key={subreddit}>{subreddit}</option>
          ))}
        </select>
      </header>
      <section>
        <h1>{current.matches("idle") ? "Select a subreddit" : subreddit}</h1>
        {current.matches({ selected: "loading" }) && <div>Loading...</div>}
        {current.matches({ selected: "loaded" }) && (
          <ul>
            {posts?.map((post) => (
              <li key={post.title}>{post.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
