/**
 * @desc 单个小程序ci任务结束后执行的hook，这在矩阵小程序中是很适合的，你可能需要对不同的矩阵小程序做不同的执行后操作
 * @static 该hook必须实现afterTaskBuild方法
 */

// 注册你的通知逻辑
function afterTaskBuild() {
  // do your afterTaskBuild hack
}

module.exports = {
  afterTaskBuild,
};
