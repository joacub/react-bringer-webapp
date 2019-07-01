import authManagement from './authManagement';
import email from './email';
import users from './users';
import hotels from './hotels';
import booking from './booking';

export default app => {
  app.configure(authManagement);
  app.configure(users);
  app.configure(email);
  app.configure(hotels);
  app.configure(booking);
};
