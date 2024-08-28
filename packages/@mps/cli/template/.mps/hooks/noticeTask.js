/**
 * @desc 构建任务完成后，执行构建通知hook
 * 将该功能提为hook的原因是不同用户的通知场景不同，如钉钉、企微、美事等，将通知功能解耦，方便使用者按需配置
 * @static 该hook必须实现getBuildInfo和notice方法
 */
<% if (Boolean(lbgNoticeTaskTemp)) { %>
<%- lbgNoticeTaskTemp %>
<% } else { %>
// 注册你的通知逻辑
function noticeTask(buildInfo) {
  // do your notice
}  
<% } -%>

module.exports = {
  noticeTask
};
