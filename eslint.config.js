// eslint.config.js
import pluginVue from 'eslint-plugin-vue'
import babelParser from '@babel/eslint-parser'

export default [
  ...pluginVue.configs['flat/essential'],
  {
    // 针对所有 JavaScript 和 Vue 文件的通用配置
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      globals: {
        // 模拟原来的 env: { node: true }
        node: true,
        // 如果需要浏览器环境，可以添加 browser: true
        // browser: true,
      },
      // 默认解析器用于 .js 文件
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },
  {
    // 针对 .vue 文件覆盖解析器为 vue-eslint-parser
    files: ['**/*.vue'],
    languageOptions: {
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: babelParser, // 用于解析模板中的 script
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },
  {
    // 自定义规则（完全复制你原来的 rules）
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'arrow-parens': 0,
      'generator-star-spacing': 0,
      'eol-last': 0,
      'space-before-function-paren': 0,
      // Vue 3 相关规则（关闭你不需要的）
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/no-mutating-props': 'off',
      // 如果你还遇到其他旧规则冲突，可以在此继续关闭或调整
    },
  },
]