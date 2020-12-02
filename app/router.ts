import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  require('./router/code')(app);
  require('./router/account')(app);
  router.get('/getUser',controller.users.index);
  router.post('/api/v1/users',controller.users.create);
  router.get('/api/v1/delUsers',controller.users.delete);
  router.get('/api/v1/editUsers',controller.users.edit);
  router.post('/api/v1/upload',controller.users.upload);
  router.post('/api/v1/import',controller.users.import);
  router.get('/api/v1/getUsers',controller.users.getUsers);
  router.get('/api/v1/getRoles',controller.roles.getRoles);
  router.post('/api/v1/roles',controller.roles.create);
  router.get('/api/v1/delRole',controller.roles.deleteOne);
  router.get('/api/v1/editRole',controller.roles.edit);
  router.post('/api/v1/userRoles',controller.userRole.create);
  router.get('/api/v1/delUserRole',controller.userRole.deleteUserRole);
  router.get('/api/v1/getRights',controller.rights.getRights);
  router.post('/api/v1/rights',controller.rights.create);
  router.get('/api/v1/delRights',controller.rights.deleteOne);
  router.get('/api/v1/editRights',controller.rights.edit);
  router.post('/api/v1/addRoleRight',controller.roleRights.create);
  router.post('/api/v1/delRoleRight',controller.roleRights.deleteRoleRight);
};
