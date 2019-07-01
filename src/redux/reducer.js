import auth from './modules/auth';
import settings from './modules/settings';
import notifs from './modules/notifs';
import users from './modules/users';
import hotels from './modules/hotels';
import online from './modules/online';

export default function createReducers(asyncReducers) {
  return {
    online,
    auth,
    settings,
    notifs,
    users,
    hotels,
    ...asyncReducers
  };
}
