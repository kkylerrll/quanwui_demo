import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import vueEslintParser from 'vue-eslint-parser';
// npx eslint --inspect-config

export default [
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    rules: {
      // 自定義規則
      // 'vue/no-unused-vars': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^(cn|_)$' }],
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'prettier/prettier': 'error',
      // 解決 LF / CRLF 的問題
      // 最根本解法是：在拉專案前輸入 git config --global core.autocrlf false
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        sourceType: 'module',
      },
      globals: {
        cn: false,
      },
    },
  },
];
