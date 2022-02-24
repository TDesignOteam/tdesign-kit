// ast todo

exports.jsxCompiler = (content) => {
  return content
    .replace("'vue'", "'@vue/composition-api'")
    .replace("'tdesign-icons-vue-next'", "'tdesign-icons-vue'")
    .replace("'v-slots'", "'scopedSlots'");
};