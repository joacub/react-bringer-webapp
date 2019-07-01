/* eslint-disable max-len */
// const ONE_DAY = 60 * 60 * 24 * 1000;
import configLocal from './config-local';

const ONE_YEAR = 365 * 60 * 60 * 24 * 1000;

const environment = {
  development: {
    isProduction: false,
    domain: 'http://localhost:3000',
    host: 'localhost',
    port: 3000
  },
  production: {
    isProduction: true,
    domain: 'https://bringer-test.webmediaprojects.net',
    host: 'bringer-test.webmediaprojects.net',
    port: 80
  }
}[process.env.NODE_ENV || 'development'];
const config = {
  ...environment,
  email: {
    user: 'contact@bringer-test.webmediaprojects.net',
    mail: 'no-reply@bringer-test.webmediaprojects.net',
    password: configLocal.email.password
  },
  mysql: {
    user: configLocal.mysql.user,
    database: configLocal.mysql.database,
    password: configLocal.mysql.password,
    options: {
      logging: false,
      dialect: 'mariadb',
      dialectOptions: {
        socketPath: '/var/run/mysqld/mysqld.sock',
        multipleStatements: true
        // charset: 'utf8mb4'
      },
      pool: {
        max: 200,
        min: 10,
        acquire: 20000,
        idle: 20000,
        handleDisconnects: true,
        evict: 20000,
        connectRetries: 5
      },
      // operatorsAliases: false
    }
  },
  mysqldev: {
    user: configLocal.mysqldev.user,
    database: configLocal.mysqldev.database,
    password: configLocal.mysqldev.password,
    options: {
      logging: e => {
        console.log('<<<<<<<<<-----------------LOG SEQUELIZE----------------->>>>>>>>>>>');
        console.log(e);
        console.log('<<<<<<<<<-----------------LOG SEQUELIZE----------------->>>>>>>>>>>');
      },
      logging: false,
      dialect: 'mariadb',
      dialectOptions: {
        // socketPath: '/Volumes/Dev/mysql.sock',
        multipleStatements: true
      },
      define: {
        freezeTableName: false,
        // charset: 'utf8mb4',
        // dialectOptions: {
        //   collate: 'utf8mb4_unicode_ci'
        // },
        timestamps: true
      },
      pool: {
        max: 200,
        min: 10,
        acquire: 20000,
        idle: 20000,
        handleDisconnects: true,
        evict: 20000,
        connectRetries: 5
      },
      // operatorsAliases: false
    }
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: configLocal.authentication.secret,
    authStrategies: ['jwt', 'local', 'oauth'],
    jwtOptions: configLocal.authentication.jwtOptions,
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    cookie: {
      enabled: true,
      httpOnly: false,
      maxAge: ONE_YEAR,
      secure: process.env.NODE_ENV === 'production'
    },
    oauth: {
      redirect: '/login?connect=1',
      defaults: {
        host: (process.env.NODE_ENV === 'production' ? 'bringer-test.webmediaprojects.net' : 'localhost:3000'),
      },
      facebook: {
        permissions: {
          authType: 'rerequest'
        },
        profileFields: ['id', 'displayName', 'photos', 'email', 'first_name', 'last_name', 'age_range'],
        scope: [
          'email',
          'public_profile',
        ],
        key: configLocal.authentication.oauth.facebook.key,
        secret: configLocal.authentication.oauth.facebook.secret,
      },
      twitter: {
        // path: '/auth/twitter',
        key: configLocal.authentication.oauth.twitter.key,
        secret: configLocal.authentication.oauth.twitter.secret,
      },
    },
  },
  uploadDir: '/static/media',
  imageVersions: {
    focal_200x200: {
      width: 200,
      height: 200,
      quality: 82,
      type: 'focal'
    },
    webp_focal_200x200: {
      width: 200,
      height: 200,
      quality: 82,
      type: 'focal',
      format: 'webp'
    },
    focal_832x302: {
      width: 832,
      height: 302,
      quality: 82,
      type: 'focal'
    },
    webp_focal_832x302: {
      width: 832,
      height: 302,
      quality: 82,
      type: 'focal',
      format: 'webp'
    },
    focal_1080x444: {
      width: 1080,
      height: 444,
      quality: 82,
      type: 'focal'
    },
    webp_focal_1080x444: {
      width: 1080,
      height: 444,
      quality: 82,
      type: 'focal',
      format: 'webp'
    },
    crop_200x200: {
      width: 200,
      height: 200,
      quality: 82,
      type: 'crop'
    },
    webp_crop_200x200: {
      width: 200,
      height: 200,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_832x302: {
      width: 832,
      height: 302,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_832x302: {
      width: 832,
      height: 302,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_1080x444: {
      width: 1080,
      height: 444,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_1080x444: {
      width: 1080,
      height: 444,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_800x240: {
      width: 800,
      height: 240,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_800x240: {
      width: 800,
      height: 240,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_320x320: {
      width: 320,
      height: 320,
      quality: 82,
      type: 'crop',
    },
    webp_fit_c_320x320: {
      width: 320,
      height: 320,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_400x400: {
      width: 400,
      height: 400,
      quality: 82,
      type: 'crop',
    },
    webp_fit_c_400x400: {
      width: 400,
      height: 400,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_304x312: {
      width: 304,
      height: 312,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_304x312: {
      width: 304,
      height: 312,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    focal_280x240: {
      width: 280,
      height: 240,
      quality: 82,
      type: 'focal'
    },
    webp_focal_280x240: {
      width: 280,
      height: 240,
      quality: 82,
      type: 'focal',
      format: 'webp'
    },
    fit_c_280x240: {
      width: 280,
      height: 240,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_280x240: {
      width: 280,
      height: 240,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_240x240: {
      width: 240,
      height: 240,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_240x240: {
      width: 240,
      height: 240,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_160x160: {
      width: 160,
      height: 160,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_160x160: {
      width: 160,
      height: 160,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_120x120: {
      width: 120,
      height: 120,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_120x120: {
      width: 120,
      height: 120,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_64x64: {
      width: 64,
      height: 64,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_64x64: {
      width: 64,
      height: 64,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_72x72: {
      width: 72,
      height: 72,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_72x72: {
      width: 72,
      height: 72,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    fit_c_1920x1080: {
      width: 1920,
      height: 1080,
      quality: 82,
      type: 'crop'
    },
    webp_fit_c_1920x1080: {
      width: 1920,
      height: 1080,
      quality: 82,
      type: 'crop',
      format: 'webp'
    },
    max_60: {
      width: 60,
      height: 60,
      quality: 20
    },
    webp_max_60: {
      width: 60,
      height: 60,
      quality: 20,
      format: 'webp'
    },
    max_560: {
      width: 560,
      height: 560,
      quality: 82
    },
    webp_max_560: {
      width: 560,
      height: 560,
      quality: 82,
      format: 'webp'
    },
    max_1200: {
      width: 1200,
      height: 1200,
      quality: 82
    },
    webp_max_1200: {
      width: 1200,
      height: 1200,
      quality: 82,
      format: 'webp'
    },
    max_1600: {
      width: 1600,
      height: 1600,
      quality: 82
    },
    webp_max_1600: {
      width: 1600,
      height: 1600,
      quality: 82,
      format: 'webp'
    },
    max_2000: {
      max: 2000,
      height: 2000,
      quality: 82
    },
    webp_max_2000: {
      max: 2000,
      height: 2000,
      quality: 82,
      format: 'webp'
    },
    max_1320x400: {
      width: 1320,
      height: 400,
      quality: 82
    },
    webp_max_1320x400: {
      width: 1320,
      height: 400,
      quality: 82,
      format: 'webp'
    },
    max_2000x750: {
      width: 2000,
      height: 750,
      quality: 82
    },
    webp_max_2000x750: {
      width: 2000,
      height: 750,
      quality: 82,
      format: 'webp'
    },
    max_600x72: {
      width: 600,
      height: 72,
      quality: 82
    },
    webp_max_600x72: {
      width: 600,
      height: 72,
      quality: 82,
      format: 'webp'
    }
  }
};

export default config;
