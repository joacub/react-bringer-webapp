import path from 'path';
import pug from 'pug';
import config from 'config';

const isProd = process.env.NODE_ENV === 'production';

module.exports = app => {
  const returnEmail = 'contact@bringeraircargo.com';

  function getLink(type, hash) {
    const port = isProd ? '' : `:${3000}`;
    const host = isProd ? 'bringeraircargo.com' : 'localhost';
    let protocol = isProd ? 'https' : 'http';
    protocol += '://';
    return `${protocol}${host}${port}/login/${type}/${hash}`;
  }

  function sendEmail(email) {
    return app
      .service('emails')
      .create(email)
      .then(result => {
        console.log('Sent email', result);
      })
      .catch(err => {
        console.log('Error sending email', err);
      });
  }

  return {
    identifyUserProps: ['username', 'email', 'name', 'bio', 'createdAt'],
    notifier(type, user) {
      console.log(`-- Preparing email for ${type}`);
      let hashLink;
      let email;
      const emailAccountTemplatesPath = path.join(__dirname, '../../', 'email-templates', 'account');
      let templatePath;
      let compiledHTML;
      switch (type) {
        case 'resendVerifySignup': // send another email with link for verifying user's email addr
          hashLink = getLink('verify', user.verifyToken);

          templatePath = path.join(emailAccountTemplatesPath, 'verify-email.pug');

          compiledHTML = pug.compileFile(templatePath)({
            logo: 'https://bringeraircargo.com/media/max_560/1*U-6cGMIUiYKWxAZAN6I7RA.png',
            name: user.name || user.email,
            hashLink,
            returnEmail
          });

          email = {
            from: { name: 'Bringer', address: config.email.mail },
            to: user.email,
            subject: 'Confirm Signup',
            html: compiledHTML
          };

          break;
        case 'verifySignup': // inform that user's email is now confirmed
          hashLink = getLink('verify', user.verifyToken);

          templatePath = path.join(emailAccountTemplatesPath, 'email-verified.pug');

          compiledHTML = pug.compileFile(templatePath)({
            logo: 'https://bringeraircargo.com/media/max_560/1*U-6cGMIUiYKWxAZAN6I7RA.png',
            name: user.name || user.email,
            hashLink,
            returnEmail
          });

          email = {
            from: { name: 'Bringer', address: config.email.mail },
            to: user.email,
            subject: 'Thank you, your email has been verified',
            html: compiledHTML
          };

          break;
        case 'sendResetPwd': // inform that user's email is now confirmed
          hashLink = getLink('reset', user.resetToken);

          templatePath = path.join(emailAccountTemplatesPath, 'reset-password.pug');

          compiledHTML = pug.compileFile(templatePath)({
            logo: 'https://bringeraircargo.com/media/max_560/1*U-6cGMIUiYKWxAZAN6I7RA.png',
            name: user.name || user.email,
            hashLink,
            returnEmail
          });

          email = {
            from: { name: 'Bringer', address: config.email.mail },
            to: user.email,
            subject: 'Reset Password',
            html: compiledHTML
          };

          break;
        case 'resetPwd': // inform that user's email is now confirmed
          hashLink = getLink('reset', user.resetToken);

          templatePath = path.join(emailAccountTemplatesPath, 'password-was-reset.pug');

          compiledHTML = pug.compileFile(templatePath)({
            logo: 'https://bringeraircargo.com/media/max_560/1*U-6cGMIUiYKWxAZAN6I7RA.png',
            name: user.name || user.email,
            hashLink,
            returnEmail
          });

          email = {
            from: { name: 'Bringer', address: config.email.mail },
            to: user.email,
            subject: 'Your password was reset',
            html: compiledHTML
          };

          break;
        case 'passwordChange':
          templatePath = path.join(emailAccountTemplatesPath, 'password-change.pug');

          compiledHTML = pug.compileFile(templatePath)({
            logo: 'https://bringeraircargo.com/media/max_560/1*U-6cGMIUiYKWxAZAN6I7RA.png',
            name: user.name || user.email,
            returnEmail
          });

          email = {
            from: { name: 'Bringer', address: config.email.mail },
            to: user.email,
            subject: 'Your password was changed',
            html: compiledHTML
          };

          break;
        case 'identityChange':
          hashLink = getLink('verifyChanges', user.verifyToken);

          templatePath = path.join(emailAccountTemplatesPath, 'identity-change.pug');

          compiledHTML = pug.compileFile(templatePath)({
            logo: 'https://bringeraircargo.com/media/max_560/1*U-6cGMIUiYKWxAZAN6I7RA.png',
            name: user.name || user.email,
            hashLink,
            returnEmail,
            changes: user.verifyChanges
          });

          email = {
            from: { name: 'Bringer', address: config.email.mail },
            to: user.email,
            subject: 'Your account was changed. Please verify the changes',
            html: compiledHTML
          };

          break;
        default:
          break;
      }
      return sendEmail(email);
    }
  };
};
