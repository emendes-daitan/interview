const environment = {
  development: {
    isProduction: false,
    assetsPath: `http://${process.env.HOST || 'localhost'}:${+process.env.PORT + 1 || 3001}/dist/`
  },
  production: {
    isProduction: true,
    assetsPath: '/dist/'
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign(
  {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT,
    app: {
      title: 'Feedback Generator',
      description: 'Interview Feedback Generator',
      head: {
        titleTemplate: 'Feedback Generator: %s',
        meta: [
          { name: 'description', content: 'Feedback Generator.' },
          { charset: 'utf-8' },
          { property: 'og:site_name', content: 'Feedback Generator' },
          { property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg' },
          { property: 'og:locale', content: 'en_US' },
          { property: 'og:title', content: 'Feedback Generator' },
          { property: 'og:description', content: 'Feedback Generator.' },
          { property: 'og:card', content: 'summary' },
          { property: 'og:site', content: '@ecauli' },
          { property: 'og:creator', content: '@ecauli' },
          { property: 'og:image:width', content: '200' },
          { property: 'og:image:height', content: '200' }
        ]
      }
    }
  },
  environment
);
