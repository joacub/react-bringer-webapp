import { hooks } from '@feathersjs/authentication';
import { hooks as localHooks } from '@feathersjs/authentication-local';
import errors from '@feathersjs/errors';
import { restrictToOwner } from 'feathers-authentication-hooks';
import {
  discard, unless, iff,
  preventChanges,
  isProvider, disallow,
  fastJoin
} from 'feathers-hooks-common';
import {
  validateHook, isEnabled, hasPermissionsBoolean, sendVerificationEmail
} from 'hooks';
import authManagement from 'feathers-authentication-management';
import {
  required, email, match, unique
} from 'utils/validation';
import {
  UserRoles, Images, User, Sequelize, I18nStories, Publications
} from 'database/Models';
// import downloadImage from 'utils/downloadImage';
import generate from 'nanoid/generate';
import Twitter from 'twitter';
import config from 'config';
import oauth from 'utils/twitter/oauth';
import FB from 'fb';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const shortid = () => generate(alphabet, 3);

const schemaValidator = {
  email: [required, email, unique('email')],
  username: [required, unique('username')],
  password: required,
  password_confirmation: [required, match('password')]
};

const schemaValidatorPatch = {
  email: [email, unique('email')],
  username: [unique('username')]
};

const createUserName = async context => {
  const { data } = context;
  if (!data.username) {
    if (data.email) {
      [data.username] = data.email.split('@');
      const existUsername = await User.findOne({ where: { username: data.username }, raw: true });
      if (existUsername) {
        data.username += shortid();
      }
    }
  }
};

function validate() {
  return async context => {
    const { data, params: { authStrategies } } = context;

    if (authStrategies && data.twitter) {
      data.twitterExtraData = data.twitter;

      const userAlreadyLoginWithTwitter = await User.findOne({ where: { twitterId: data.twitterId } });
      if (!userAlreadyLoginWithTwitter) {
        data.username = data.twitter.screen_name;
        data.email = null;
        const usernameExist = await User.findOne({ where: { username: data.username } });
        if (usernameExist) {
          data.username += shortid();
        }
        data.name = data.twitter.name;
        if (data.twitter.profile_image_url) {
          // data.avatar = await downloadImage(data.twitter.profile_image_url);
        }
      }

      const result = await context.service.find({ query: { twitterId: data.twitterId } });
      if (result.total !== 0) {
        [context.result] = result.data;
        return;
      }
      return;
    }
    if (authStrategies && data.facebook) {
      data.facebookExtraData = data.facebook;
      data.email = data.facebook.email;
      if (!data.email) {
        throw new errors.BadRequest('Email is required', data);
      }
      const userAlreadyLoginWithFacebook = await User.findOne({ where: { facebookId: data.facebookId } });
      if (!userAlreadyLoginWithFacebook) {
        [data.username] = data.email.split('@');
        const usernameExist = await User.findOne({ where: { username: data.username } });
        if (usernameExist) {
          data.username += data.facebookId;
        }
        data.name = data.facebook.name;
        data.gender = data.facebook.gender;
        if (data.facebook.picture.data.url) {
          // data.avatar = await downloadImage(data.facebook.picture.data.url);
        }
      }

      const result = await context.service.find({ query: { email: data.email } });
      if (result.total !== 0) {
        const UserModel = await User.findOne({ where: { email: data.email } });
        await UserModel.update({ facebook: data.facebook, facebookExtraData: data.facebook, facebookId: data.facebookId });
        [context.result] = result.data;
        return;
      }
      return;
    }

    return validateHook(schemaValidator)(context);
  };
}

function validatePatch() {
  return hook => validateHook(schemaValidatorPatch)(hook);
}

// return hook => {
//   hook.data.UserRoleId = 3;
// };
function includeRole() {
  return hook => {
    hook.params.sequelize = {
      nest: true,
      include: [
        {
          model: UserRoles,
          attributes: ['role']
        },
        {
          model: Images,
          as: 'avatar',
          attributes: [['md5', 'id'], 'md5', 'height', 'width', 'format']
        }
      ]
    };
  };
}

const fillRole = () => async hook => {
  hook.data.UserRoleId = await UserRoles.findOne({
    where:
    { role: 'user' },
    raw: true
  }).then(r => r.id);
};

const parseParamsBeforeSave = async hook => {
  if (hook.data.connectFacebook) {
    await new Promise((resolve, reject) => {
      FB.api('oauth/access_token', {
        client_id: config.authentication.oauth.facebook.clientID,
        client_secret: config.authentication.oauth.facebook.clientSecret,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: hook.data.accessToken
      }, res => {
        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          resolve();
          return;
        }

        const accessToken = res.access_token;
        const expires = res.expires ? res.expires : 0;

        FB.setAccessToken(accessToken);
        FB.api('me', {
          fields: ['address',
            'email',
            'last_name',
            'website',
            'work',
            'picture',
            'about',
            'age_range',
            'id',
            'installed',
            'is_shared_login',
            'middle_name',
            'gender',
            'political',
            'quotes',
            'significant_other',
            'albums',
            'name_format',
            'short_name',
            'hometown',
            'birthday',
            'interested_in', 'name', 'first_name',
            'link'
          ],
          access_token: accessToken
        }, _res => {
          hook.data.facebookId = _res.id;
          hook.data.facebookExtraData = { ..._res, accessToken, accessTokenExpires: expires };
          resolve();
        });
      });
    });
  }

  if (hook.data.connectTwitter) {
    const resultTwitter = await new Promise((resolve, reject) => {
      oauth.getOAuthAccessToken(hook.data.oauth_token, config.twitter.access_token_secret, hook.data.oauth_verifier,
        // eslint-disable-next-line camelcase
        (error, oauth_access_token, oauth_access_token_secret, results) => {
          const result = {
            error, oauth_access_token, oauth_access_token_secret, results
          };
          resolve(result);
        });
    });

    if (resultTwitter) {
      hook.data.twitterId = resultTwitter.results.user_id;
      hook.data.twitterExtraData = {
        ...resultTwitter.results,
        access_token_key: resultTwitter.oauth_access_token,
        access_token_secret: resultTwitter.oauth_access_token_secret
      };

      const twitterClient = new Twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: resultTwitter.oauth_access_token,
        access_token_secret: resultTwitter.oauth_access_token_secret
      });

      const params = { user_id: resultTwitter.results.user_id };
      const userTwitterData = await twitterClient.post('users/lookup', params).then(r => r[0]).catch(console.error);
      if (userTwitterData) {
        hook.data.twitterExtraData = {
          ...userTwitterData,
          access_token_key: resultTwitter.oauth_access_token,
          access_token_secret: resultTwitter.oauth_access_token_secret
        };
      }
    }
  }

  if (hook.data && hook.data.password) {
    hook.data.invalidTokensBeforeAt = new Date();
  }
  if (hook.data.avatar) {
    hook.data.avatarId = await Images.findOne({
      where: { md5: hook.data.avatar.id },
      raw: true
    }).then(result => result && result.id);
  } else if (hook.data.avatar === null) {
    hook.data.avatarId = null;
  }
};

const customizeQuery = async context => {
  if (context.params.query) {
    if (context.params.query.includePosts) {
      delete context.params.query.includePosts;
      context.params.includePosts = true;
    }
    if (context.params.query.usernameAvailable) {
      const { user = {} } = context.params;
      context.result = await User.find({
        where: {
          username: context.params.query.usernameAvailable,
          id: { [Sequelize.Op.ne]: user.id }
        }
      }).then(r => r ? [{ result: false }] : { result: true });
      return;
    }

    if (context.params.query.emailAvailable) {
      const { user = {} } = context.params;
      context.result = await User.find({
        where: {
          email: context.params.query.emailAvailable,
          id: { [Sequelize.Op.ne]: user.id }
        }
      }).then(r => r ? [{ result: false }] : { result: true });
      return;
    }
    if (context.params.query.$paginate !== undefined) {
      context.params.paginate = context.params.query.$paginate === 'false' || context.params.query.$paginate === false;
      delete context.params.query.$paginate;
    }

    if (context.params.query.like) {
      context.params.sequelize.where = {
        username: {
          [Sequelize.Op.like]: `%${context.params.query.like}%`
        }
      };
      delete context.params.query.like;
    }
  }
};

const tryJsonDecode = str => {
  if (typeof str === 'object') { return str; }
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

function parseJson() {
  return hook => {
    if (hook.result && hook.result.data && hook.result.data[0]) {
      if (hook.result.data[0].verifyChanges) {
        hook.result.data[0].verifyChanges = tryJsonDecode(hook.result.data[0].verifyChanges);
      }
      if (hook.result.data[0].facebook) {
        hook.result.data[0].facebook = tryJsonDecode(hook.result.data[0].facebook);
      }
    }
  };
}

const isNotMe = hook => {
  if (!hook.params) {
    return true;
  }
  const { user = {} } = hook.params;
  if (!user) {
    return true;
  }

  if (hook.results) {
    if (hook.results.length > 1) {
      return true;
    }
    return !hook.results[0].username === user.username;
  }

  return false;
};

const postResolvers = {
  joins: {
    posts: () => async user => {
      user.posts = await I18nStories.findAll({
        raw: true,
        nest: true,
        attributes: ['uid', 'slug',
          'title', 'subtitle',
          'publishDate', 'readingTime',
          'commentsCount'],
        where: {
          status: 'public',
          UserId: user.id
        },
        limit: 10,
        order: [['publishDate', 'DESC']],
        include: [
          {
            model: Images,
            as: 'featureImg',
            attributes: [['md5', 'id'], 'md5', 'height', 'width', 'format']
          },
          {
            model: Publications,
            attributes: ['slug', 'uid', 'name']
          }
        ]
      });
    },
  }
};

const userHooks = {
  before: {
    find: [
      hooks.authenticate({ strategies: ['jwt'] }),
      isEnabled(),
      includeRole(),
      customizeQuery
    ],
    get: [hooks.authenticate({ strategies: ['jwt'] }), isEnabled(), includeRole()],
    create: [
      createUserName,
      validate(),
      authManagement.hooks.addVerification(),
      fillRole(),
      parseParamsBeforeSave,
      discard('password_confirmation'),
      localHooks.hashPassword('password')
    ],
    update: [disallow('external'), includeRole()],
    patch: [
      validatePatch(),
      hooks.authenticate({ strategies: ['jwt'] }),
      isEnabled(),
      unless(hasPermissionsBoolean('manageUsers'), restrictToOwner({ ownerField: '_id' })),
      iff(
        isProvider('external'),
        preventChanges(
          true,
          'email',
          'username',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        )
      ),
      includeRole(),
      parseParamsBeforeSave
    ],
    remove: [
      hooks.authenticate({ strategies: ['jwt'] }),
      isEnabled(),
      unless(hasPermissionsBoolean('manageUsers'), restrictToOwner({ ownerField: '_id' }))
    ]
  },
  after: {
    all: [localHooks.protect(
      'password',
      'facebook',
      'twitter',
      'facebookExtraData',
      'twitterExtraData',
      'verifyExpires',
      'resetExpires',
      'verifyChanges'
    ), iff(isNotMe, localHooks.protect(
      'email',
      'verifyToken',
    ))],
    find: [parseJson(), iff(hook => {
      const result = hook.params && hook.params.includePosts;
      return result;
    }, fastJoin(postResolvers))],
    get: [],
    create: [sendVerificationEmail(), authManagement.hooks.removeVerification()],
    update: [],
    patch: [],
    remove: []
  }
};

export default userHooks;
