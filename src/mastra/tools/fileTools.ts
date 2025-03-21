import { createTool } from "@mastra/core/tools";
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

/**
 * ファイル保存ツールを作成します
 */

const fileSaveTool = createTool({
  id: "Save File",
  description:
    "Saves the contents to a file and returns the file name if successful.",
  inputSchema: z.object({
    contents: z.string().describe("The contents to save."),
    fileName: z.string().describe("The name of the file to save to."),
    overwrite: z
      .boolean()
      .optional()
      .default(true)
      .describe("Overwrite the file if it already exists."),
    baseDir: z
      .string()
      .default("./data")
      .describe("The base directory to save the file to."),
  }),
  execute: async ({ context }) => {
    try {
      const { contents, fileName, overwrite, baseDir } = context;
      const filePath = path.join(baseDir, fileName);

      console.log(`Saving contents to ${filePath}`);

      // 親ディレクトリが存在しない場合は作成
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // ファイルが存在していて上書きしない場合はエラー
      if (fs.existsSync(filePath) && !overwrite) {
        return {
          success: false,
          message: `File ${fileName} already exists`,
        };
      }

      // ファイルの書き込み
      fs.writeFileSync(filePath, contents);
      console.log(`Saved: ${filePath}`);

      return {
        success: true,
        fileName: fileName,
      };
    } catch (e) {
      const error = e as Error;
      console.error(`Error saving to file: ${error.message}`);
      return {
        success: false,
        message: `Error saving to file: ${error.message}`,
      };
    }
  },
});

/**
 * ファイル読み込みツールを作成します
 */
const fileReadTool = createTool({
  id: "Read File",
  description:
    "Reads the contents of the file and returns the contents if successful.",
  inputSchema: z.object({
    fileName: z.string().describe("The name of the file to read."),
    baseDir: z
      .string()
      .default("./data")
      .describe("The base directory to read the file from."),
  }),
  execute: async ({ context }) => {
    try {
      const { fileName, baseDir } = context;
      console.log(`Reading file: ${fileName}`);

      const filePath = path.join(baseDir, fileName);

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: `File ${fileName} does not exist`,
        };
      }

      const contents = fs.readFileSync(filePath, "utf8");

      return {
        success: true,
        contents: contents,
      };
    } catch (e) {
      const error = e as Error;
      console.error(`Error reading file: ${error.message}`);
      return {
        success: false,
        message: `Error reading file: ${error.message}`,
      };
    }
  },
});

/**
 * ファイル一覧ツールを作成します
 */
const fileListFilesTool = createTool({
  id: "List Files",
  description: "Returns a list of files in the base directory",
  inputSchema: z.object({
    baseDir: z
      .string()
      .default("./data")
      .describe("The base directory to list files from."),
  }),
  execute: async ({ context }) => {
    try {
      const { baseDir } = context;
      console.log(`Reading files in: ${baseDir}`);

      if (!fs.existsSync(baseDir)) {
        return {
          success: false,
          message: `Directory ${baseDir} does not exist`,
        };
      }

      const files = fs.readdirSync(baseDir);

      return {
        success: true,
        files: files.map((file) => path.join(baseDir, file)),
      };
    } catch (e) {
      const error = e as Error;
      console.error(`Error reading files: ${error.message}`);
      return {
        success: false,
        message: `Error reading files: ${error.message}`,
      };
    }
  },
});

export { fileSaveTool, fileReadTool, fileListFilesTool };
