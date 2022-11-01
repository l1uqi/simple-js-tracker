import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: "core/index.js", // 要打包的文件(打包入口文件)
  output: [
    {
      file: "lib/index.js",
      format: "umd",
      name: "FSTracker",
    },
  ],
  plugins: [
    babel({
      // 过滤文件
      exclude: "node_modules/**",
    }),
    uglify()
  ],
};
