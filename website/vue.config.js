module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pages: {
    'authenticate-prompt': {
      entry: 'src/pages/authenticate-prompt/main.ts',
      template: 'public/index.html',
      filename: 'authenticate-prompt.html',
      title: 'Authorize application | Wulkanowy Bridge',
    },
  },
};
