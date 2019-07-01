const environment = {
  development: {
    domain: 'http://localhost:3000',
    domainIframe: 'http://localhost:3000',
    domainImages: 'http://localhost:3000',
    isProduction: false,
    assetsPath: `http://${process.env.HOST || 'localhost'}:${+process.env.PORT + 1 || 3001}/dist/`
  },
  production: {
    isProduction: true,
    assetsPath: '/dist/',
    domain: 'https://bringeraircargo.com',
    domainIframe: 'https://iframe.bringeraircargo.com',
    domainImages: 'https://bringeraircargo.com',
  }
}[process.env.NODE_ENV || 'development'];

const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'Bringer',
    description: 'Bringer - Stories And More',
    head: {
      titleTemplate: '%s',
      defaultTitle: 'Bringer',
      link: [
        { type: 'text/plain', rel: 'author', href: 'https://bringeraircargo.com/humans.txt' },
      ],
      meta: [
        { name: 'description', content: 'Bringer - Storeis And More.' },
        { charset: 'utf-8' },
        { property: 'fb:pages', content: '2198307663748082' },
        { property: 'fb:app_id', content: '296111991114313' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Bringer - Stories And More' },
        { property: 'og:image', content: 'https://bringeraircargo.com/media/max_1200/1*NaXapbTluUAlP1Xmqib5mQ.png' },
        // { property: 'twitter:image:src', content: 'https://bringeraircargo.com/media/max_1200/1*NaXapbTluUAlP1Xmqib5mQ.png' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:title', content: 'Bringer - Stories And More' },
        { property: 'og:description', content: 'Bringer - Stories And More.' },
        // { property: 'og:card', content: 'summary' }
        { property: 'twitter:site', content: '@Bringer' },
        { property: 'og:site', content: '@Bringer' },
        { property: 'og:creator', content: '@Bringer' },
        // { property: 'og:image:width', content: '200' },
        // { property: 'og:image:height', content: '200' }
      ]
    }
  }
};

Object.assign(config, environment);

export default config;
