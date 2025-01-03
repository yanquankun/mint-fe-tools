module.exports = {
  // 补充node规则 取消console等nodeapi error
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  ignorePatterns: [
    '.nx/',
    '**/jest.config.js',
    '**/node_modules/**',
    '**/dist/**',
    '**/fixtures/**',
    '**/coverage/**',
    '**/__snapshots__/**',
    '**/.docusaurus/**',
    '**/build/**',
    '.nx/*',
    '.yarn/*',
    'packages/@mpsc/cli/template/**',
    'packages/@mpsc/cli/static/**',
    'packages/@mpsc/cli-lbg/templates/**',
  ],
  rules: {
    indent: [
      'error',
      2,
      {
        MemberExpression: 'off',
      },
    ],
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'quote-props': 'off',
    'no-shadow': ['error'],
    'no-var': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      },
    ],
  },
};
