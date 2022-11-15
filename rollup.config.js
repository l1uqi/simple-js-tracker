import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import rollupTypescript from 'rollup-plugin-typescript2'
import json from "@rollup/plugin-json"

export default {
  input: "core/index.ts", // 要打包的文件(打包入口文件)
  output: [
    {
      file: "lib/index.esm.js",
      format: "es",
      name: "SimpleJsTracker",
    },
    {
      file: "lib/index.cjs.js",
      format: "cjs",
      name: "SimpleJsTracker",
    },
    {
      file: "lib/index.js",
      format: "umd",
      name: "SimpleJsTracker",
    },
  ],
  plugins: [
    rollupTypescript(),
    babel({
      // 过滤文件
      exclude: "node_modules/**",
    }),
    json(),
    uglify()
  ]
};
