const isNotAdmin = adminRole => context => {
  // avoid internal calls
  if (!context.params.provider) {
    return true;
  }
  return context.params.user.UserRole.role.indexOf(adminRole || 'admin') === -1;
};
export default isNotAdmin;
