const axios = require("axios");
const crypto = require("crypto");
const secret = "35246235877084800650940180230063";
const groupId = "439164";
const appid = "58-increase-fe";
const senderId = "MIS_ROBOT_58-increase-fe";
const host = "http://openapi.mism.58dns.org";
const testHost = "http://openapi-meishi.58v5.cn";

function my_md5(timestamp, random) {
  const sha1 = crypto.createHash("md5");
  return sha1.update(timestamp + secret + random).digest("hex");
}

// 注册你的通知逻辑
async function noticeTask(buildInfo) {
  // do your notice
  const now = +new Date();
  const trace = now.toString();
  const random = now.toString().slice(0, 8);
  const sign = my_md5(now, random);
  // 群通知
  const url = host + "/v2/msg/sendGroupMsg";
  // 单聊
  // const url = host + "/v2/msg/sendMsg";

  const extraInfo = buildInfo.extraInfo || {};
  const qrcodeFiles = buildInfo.qrcodeFiles || [];
  const tests = [
    {
      secondContent: "提交者",
      content: `<mis type='highlight' color=\"#fd642d\">${extraInfo.user}</mis>`,
    },
    {
      secondContent: "分支",
      content: `<mis type='highlight' color=\"#fd642d\">${extraInfo.branch}</mis>`,
    },
    {
      secondContent: "仓库地址",
      content: `<mis type='highlight' color=\"#fd642d\">${extraInfo.reomte}</mis>`,
    },
  ];
  if (extraInfo.buildSuccessAppNames)
    tests.unshift({
      secondContent: "构建应用",
      content: `<mis type='highlight' color=\"#fd642d\">${extraInfo.buildSuccessAppNames}</mis>`,
    });
  if (extraInfo.tag)
    tests.push({
      secondContent: "生成gitTag",
      content: `<mis type='highlight' color=\"#fd642d\">${extraInfo.tag}</mis>`,
    });
  const cardList = [...tests];
  Array.isArray(qrcodeFiles) &&
    qrcodeFiles.forEach((info) => {
      cardList.push({
        imgText: {
          content: info.fileName,
          url: info.baseUrl,
          w: 9,
          h: 9,
          previewUrl: info.baseUrl,
          canPreview: 1,
        },
      });
    });

  await axios
    .post(
      url,
      {
        senderId,
        toId: groupId,
        showType: "MIS:cardInteractive",
        content: JSON.stringify({
          type: "MIS:cardInteractive",
          card: {
            topicId: groupId,
            stateless: true,
            title: {
              icon: "",
              text: buildInfo.isProd
                ? "小程序体验版|生产版发布通知"
                : "小程序本地版发布通知",
              color: buildInfo.isProd ? "orange" : "blue",
            },
            textSect: {
              mutableElems: {
                default: cardList,
              },
              defaultState: "default",
            },
            pushData: "有新的构建通知~",
            clickState: 1,
            canForward: 1,
          },
        }),
        // content: '{"type":"text", "msg":"这是测试消息\\n小老弟"}',
        // toOa: "yanquankun",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "ms-appid": appid,
          "ms-timestamp": now,
          "ms-random": random,
          "ms-sign": sign,
          "ms-trace": trace,
        },
      }
    )
    .then(function (response) {
      if (response && response.data && response.data.success === true) {
        console.log("消息发送成功");
      } else console.log("消息发送失败:", response.data.msg);
    })
    .catch(function (error) {
      console.log("消息发送失败", error);
    });
}