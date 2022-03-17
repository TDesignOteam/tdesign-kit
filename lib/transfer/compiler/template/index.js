// 状态机状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6, // 结束标签名称状态
};
function isAlpha(char) {
  return (
    (char >= "a" && char <= "z") ||
    (char >= "A" && char <= "Z") ||
    (char === '-')
  );
}

const tokenzie = (str) => {
  let currentState = State.initial; // 初始状态
  const chars = []; // 缓存字符
  const tokens = []; // token列表
  const attrs = []; // attrs 列表

  while (str) {
    const char = str[0]; // 查看当前字符
    if(char == ' ') {
      str = str.slice(1);
      continue;
    }
    // 状态匹配
    switch (currentState) {
      case State.initial:
        if (char === "<") {
          currentState = State.tagOpen; // 1.状态切换
          str = str.slice(1); // 2.消费字符
        } else if (isAlpha(char)) {
          currentState = State.text; // 1.状态切换
          chars.push(char); // 2.缓存字符
          str = str.slice(1); // 3.消费字符
        }
        break;
      case State.tagOpen:
        if (isAlpha(char)) {
          currentState = State.tagName; // 1.状态切换，遇到字母
          chars.push(char); // 2.缓存字符
          str = str.slice(1); // 3.消费字符
        } else if (char === "/") {
          currentState = State.tagEnd; // 状态切换，遇到‘/’
          str = str.slice(1); // 3.消费字符
        }
        break;
      case State.tagName:
        if (isAlpha(char)) {
          // 遇到字母，保持标签名称状态
          chars.push(char); // 1.缓存字符
          str = str.slice(1); // 3.消费字符
        } else if (char === ">") {
          currentState = State.initial; // 1. 遇到字符 '>', 切换到初始状态
          // 2，创建标签 `token`
          tokens.push({
            type: "tag",
            name: chars.join(""),
          });
          chars.length = 0; // 3.清空缓存数组
          str = str.slice(1); // 4.消费当前字符
        }
        break;
      case State.text:
        if (isAlpha(char)) {
          chars.push(char); // 1. 遇到字母，保持状态不变
          str = str.slice(1); // 2.消费字符串
        } else if (char === "<") {
          currentState = State.tagOpen; // 1. 遇到'<'，切换为标签开始状态
          // 2，创建文字 `token`
          tokens.push({
            type: "text",
            content: chars.join(""),
          });
          chars.length = 0; // 3.清空缓存数组
          str = str.slice(1); // 4. 消费当前字符
        }
        break;
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName; // 1.切换至结束标签名称状态
          chars.push(char); // 2.字符缓存
          str = str.slice(1); // 3. 消费当前字符
        }
        break;
      case State.tagEndName:
        if (isAlpha(char)) {
          chars.push(char); // 1. 字符缓存
          str = str.slice(1); // 2. 消费当前字符
        } else if (char === ">") {
          currentState = State.initial;
          tokens.push({
            type: "tagEnd",
            name: chars.join(""),
          });
          chars.length = 0; // 3.清空缓存数组
          str = str.slice(1); // 4. 消费当前字符
        }
        break;
    }
  }
  return tokens;
};

const TdAST = (TdTemplateAST) => {
  return TdTemplateAST;
};

const generate = (TdAST) => {
  return TdAST;
};

// 类型1: vue3 to vue2, 类型2: vue2 to vue3
module.exports = (data, type = 1) => {
  const lines = data.split("\n");
  let i = 0;
  const res = [];
  while (i < lines.length) {
    res.push(lines[i]);
    if (res[i].includes("slot")) {
      const line = tokenzie('<add-icon slot="icon"/>');
      // console.log(tokenzie(line));
    }
    i++;
  }
  return res.join("\n");
};
