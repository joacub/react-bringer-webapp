// Initializes the `email` service on path `/email`
import Mailer from 'feathers-mailer';
import smtpTransport from 'nodemailer-smtp-transport';
import config from 'config';
import hooks from './hooks';

module.exports = app => {
  // Initialize our service with any options it requires
  app.use(
    '/emails',
    Mailer(
      smtpTransport({
        service: 'gmail',
        port: 465,
        secure: true, // use TLS
        auth: {
          user: config.email.user,
          pass: config.email.password
        }
      })
    )
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emails');

  service.hooks(hooks);
};
