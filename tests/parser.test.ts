import { defaultModules, LogParser } from "../LogParser";
import fs from "fs/promises";

import sixesJson from "../logs/log_6s.json";
import hlJson from "../logs/log_hl.json";
import bballJson from "../logs/log_bball.json";
import GameStateModule from "../modules/GameStateModule";

describe("logs-parser", () => {
  let logParser: LogParser;

  beforeAll(() => {
    const testingParser = new LogParser();

    for (const module of Object.values(defaultModules)) {
      testingParser.addModule(module);
    }

    logParser = testingParser;
  });

  it("can load", () => {
    expect(logParser).toBeDefined();
  });

  it("will not duplicate modules", () => {
    expect(logParser.modules.length).toBe(9);

    logParser.addModule(defaultModules.ChatModule);

    expect(logParser.modules.length).toBe(9);
  });

  describe("can full parse", () => {
    it("a sixes (6s) game", async () => {
      const lines = await fs.readFile("./logs/log_6s.log", {
        encoding: "utf-8",
      });

      const game = logParser.parseLines(lines.split("\n"));

      expect(game.toJSON()).toMatchObject(sixesJson);
    });

    it("a highlander (hl) game", async () => {
      // https://logs.tf/2890935
      const lines = await fs.readFile("./logs/log_hl.log", {
        encoding: "utf-8",
      });

      const game = logParser.parseLines(lines.split("\n"));

      expect(game.toJSON()).toMatchObject(hlJson);
    });

    it("a bball game", async () => {
      const lines = await fs.readFile("./logs/log_bball.log", {
        encoding: "utf-8",
      });

      const game = logParser.parseLines(lines.split("\n"));

      expect(game.toJSON()).toMatchObject(bballJson);
    });
  });
});
