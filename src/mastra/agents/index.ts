import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';

import { Memory } from '@mastra/memory';

import { DefaultStorage } from '@mastra/core/storage/libsql';
import mcp from '../mcp';
import { fileSaveTool, fileReadTool, fileListFilesTool } from '../tools/fileTools';
import { planningTools } from '../tools/plannning-tools';

export const weatherAgent = new Agent({
  name: 'test assistant',
  instructions: `あなたは複数のツールを使ってユーザから与えられたタスクを解決するアシスタントです。
  ## ツール
  - planning
    - タスクを達成するための計画を作成する
  - duckduckgo
    - インターネットを検索する
  - browserUse
    - ブラウザを使ってタスクを実行する
  - fileSave
    - ファイルを保存する
  - fileRead
    - ファイルを読み込む
  - fileListFiles
    - ファイルをリストアップする
  `,
  model: google('gemini-2.0-flash'),
  tools: {
    ...(await mcp.getTools()),
    planning: planningTools,
    fileSave: fileSaveTool,
    fileRead: fileReadTool,
    fileListFiles: fileListFilesTool,
  },
  memory: new Memory({
    storage: new DefaultStorage({
      config: {
        url: 'file:example.db',
      },
    }),
  }),
});
