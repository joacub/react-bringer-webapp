export default function isAdminSync(auth) {
  const { user, loaded } = auth;
  return loaded && user !== null && user.UserRoleId === 1;
}
