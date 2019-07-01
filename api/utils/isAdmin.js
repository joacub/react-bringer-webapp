export default async function isAdmin(auth, app) {
  const { loading } = auth;
  let { user, loaded } = Object.assign({}, auth);
  if (loading) {
    const authResult = await Promise.resolve(app.get('authentication')).catch(() => null);
    if (authResult) {
      ({ user } = authResult);
      loaded = true;
    }
  }
  return loaded && user !== null && user.UserRoleId === 1;
}
