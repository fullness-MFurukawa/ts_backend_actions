import { pathsToModuleNameMapper } from "ts-jest";
import { readFileSync } from "fs";
import { join } from "path";

// tsconfig.jsonを読み込む
const tsconfig = JSON.parse(readFileSync(join(__dirname, "tsconfig.json"), "utf8"));

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: "<rootDir>/" })
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  testMatch: [
    "**/test/**/*.spec.ts"  // *.tsファイルのみを対象にする
  ],

  // Jestのレポート出力設定（JUnit形式）
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports/junit",  // 出力先ディレクトリ
        outputName: "jest-results.xml",    // ファイル名
      },
    ],
  ],
};