const Configuration = {
  extends: ['@commitlint/config-conventional'],
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // 构建变更
        'feat', // 新功能
        'fix', // 修复
        'docs', // 文档
        'update', // 更新
        'chore', // 其他
        'lint', // 工程化修改
        'init', // 工程初始化
      ],
    ],
  },
};

module.exports = Configuration;
