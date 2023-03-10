import { interpret } from "xstate";
import { describe, assert, it } from "vitest";
import { redditMachine } from "./redditMachine";

describe("reddit machine (live)", () => {
  it("should load posts of a selected subreddit", () => {
    const redditService = interpret(redditMachine)
      .onTransition((state) => {
        if (state.matches({ selected: "loaded" })) {
          assert.isNotEmpty(state.context.subreddit);
          assert.isNotEmpty(state.context.posts);
        }
      })
      .start();

    redditService.send({ type: "SELECT", name: "reactjs" });
  });
});
