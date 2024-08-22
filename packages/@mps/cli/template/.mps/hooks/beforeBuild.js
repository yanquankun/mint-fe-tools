/**
 * @desc 整个ci任务开始前执行的hook
 * @static 该hook必须实现beforeBuild方法
 */

// 注册你的通知逻辑
function beforeBuild() {
  // do your beforeBuild hack
}

module.exports = {
  beforeBuild,
};
