module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pages: {
    'authenticate-prompt': {
      entry: 'src/pages/authenticate-prompt/main.ts',
      template: 'public/index.html',
      filename: 'authenticate-prompt.html',
      title: 'Autoryzuj aplikację | Wulkanowy Bridge',
    },
    'prompt-error': {
      entry: 'src/pages/prompt-error/main.ts',
      template: 'public/index.html',
      filename: 'prompt-error.html',
      title: 'Błąd autoryzacji | Wulkanowy Bridge',
    },
    developer: {
      entry: 'src/pages/developer/main.ts',
      template: '/public/index.html',
      filename: 'developer.html',
      title: 'Konsola dewelopera | Wulkanowy Bridge',
    },
  },
};
