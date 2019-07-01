export default function canAll(auth) {
  return (
    auth.loaded && auth.user !== null && auth.user.UserRole.role === 'admin'
  );
}
