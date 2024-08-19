/**
 * @desc 构建任务完成后，执行构建通知hook
 * 将该功能提为hook的原因是不同用户的通知场景不同，如钉钉、企微、美事等，将通知功能解耦，方便使用者按需配置
 * @static 该hook必须实现getBuildInfo和notice方法
 */

// cli将构建后的信息传递给使用者
function getBuildInfo(buildInfo, gituser) {
  // 获取构建后的信息buildInfo
}

// 注册你的通知逻辑
function notice() {
  // do your notice
}

module.exports = {
  getBuildInfo,
  notice,
};
