/**
 * @desc 整个ci任务开始结束后执行的hook
 * @static 该hook必须实现afterBuild方法
 */

// 注册你的通知逻辑
function afterBuild() {
  // do your afterBuild hack
}

module.exports = {
  afterBuild,
};
