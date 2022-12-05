import { describe, it, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";
import BacklogView from "./BacklogView.vue";
import { render } from "@testing-library/vue";

const server = setupServer();

describe("backlog view", () => {
  beforeAll(() => {
    server.listen();
    window.history.pushState({}, "", "/backlog");
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  const issues = [
    { id: 1, title: "Issue 1" },
    { id: 2, title: "Issue 2" },
  ];

  const ISSUE_URL = "http://localhost:3000/issues";

  const getIssues = () =>
    rest.get(ISSUE_URL, (req, res, ctx) => res(ctx.json(issues)));

  it("renders issues", async () => {
    server.use(getIssues());
    const screen = render(BacklogView);
    for (const issue of issues) {
      screen.findByText(issue.title);
    }
  });
});
