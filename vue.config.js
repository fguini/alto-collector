module.exports = {
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.altoit.collectr',
        copyright: 'Copyright © 2020 ${author}',
        icon: './src/assets/icon.ico',
        productName: 'Alto Collectr',
      },
      externals: ['knex', 'sqlite3'],
      mainProcessWatch: ['src/core/**/*'],
      nodeIntegration: true,
    },
    i18n: {
      enableInSFC: false,
      fallbackLocale: 'en',
      locale: 'en',
      localeDir: 'locales',
    },
  },
};
