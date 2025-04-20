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
    "default", // 通常の出力も維持
    [
      "jest-junit",
      {
        outputDirectory: "test-results/jest", // 出力先ディレクトリ
        outputName: "results.xml",            // 出力ファイル名
        addFileAttribute: true                // ファイル名を出力に含める（任意）
      }
    ]
  ]
};