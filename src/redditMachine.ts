import { createMachine, assign } from "xstate";

type Nullable<T> = T | null;

type SubredditContext = { subreddit: Nullable<string>; posts: Nullable<any[]> };
type SubredditEvents = { type: "SELECT"; name: string };
type SubredditTypestate =
  | {
      value: "idle";
      context: SubredditContext & { subreddit: null; posts: null };
    }
  | {
      value: "selected";
      context: SubredditContext;
    }
  | {
      value: { selected: "loading" };
      context: SubredditContext & { subreddit: string };
    }
  | {
      value: { selected: "loaded" };
      context: SubredditContext & { subreddit: string; posts: any[] };
    }
  | {
      value: { selected: "failed" };
      context: SubredditContext; //TODO:
    };

function invokeFetchSubreddit(context: SubredditContext) {
  const { subreddit } = context;
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then((response) => response.json())
    .then((json) => json.data.children.map((child: any) => child.data));
}

export const redditMachince = createMachine<
  SubredditContext,
  SubredditEvents,
  SubredditTypestate
>({
  id: "reddit",
  predictableActionArguments: true,
  initial: "idle",
  context: {
    subreddit: null,
    posts: null,
  },
  states: {
    idle: {},
    selected: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            id: "fetch-subreddit",
            src: invokeFetchSubreddit,
            onDone: {
              target: "loaded",
              actions: assign({
                posts: (context, event) => event.data,
              }),
            },
            onError: "failed",
          },
        },
        loaded: {},
        failed: {},
      },
    },
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign({
        subreddit: (context, event) => event.name,
      }),
    },
  },
});
