import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";

/**
 * ユーザからタスクを受け取り、そのタスクを達成するための計画を作成するツール
 */
const planningTools = createTool({
  id: "planning",
  description: "Planning tools",
  inputSchema: z.object({
    task: z.string().describe("The task to plan for."),
  }),
  execute: async ({ context }) => {
    const { task } = context;
    const agent = new Agent({
      name: "test assistant",
      instructions: `
        あなたはタスクを達成するための計画を作成するアシスタントです。
        計画を作成してください。計画はタスクを達成するための順序を記述してください。

        ## タスク
        ${task}

        ## 計画schema
        1. タスク1
        2. タスク2
        3. タスク3

        ## 計画例
        1. ユーザのタスクを理解し定義する
        2. web検索を行う
        3. 検索結果を整理する
        4. 整理した情報をファイルに保存する
        `,
      model: google("gemini-2.0-flash"),
    });

    const result = await agent.generate(task);
    return result;
  },
});

export { planningTools };
