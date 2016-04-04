var accessTokenModelName, adminUser, authModelName;

authModelName = 'user';

accessTokenModelName = 'accessToken';

adminUser = {
  email: process.env.LB_SU_UN,
  username: 'superadmin',
  password: process.env.LB_SU_PW,
  created: new Date
};

module.exports = function(loopbackApplication) {
  var ACL, AccessToken, Role, RoleMapping, User, createDefaultAdmin, createSuperAdminRole;
  ACL = loopbackApplication.models.ACL;
  Role = loopbackApplication.models.Role;
  RoleMapping = loopbackApplication.models.RoleMapping;
  User = loopbackApplication.models[authModelName];
  AccessToken = loopbackApplication.models[accessTokenModelName];
  if (!User) {
    User = loopbackApplication.models.User;
  }
  User.count(function(error, count) {
    if (error) {
      console.log('Error setting up default admin.');
      console.dir(error);
      return;
    }
    return Role.findOne({
      where: {
        name: 'SuperAdmin'
      }
    }, function(error, result) {
      if (error) {
        console.log('Error setting up default SuperAdmin Role.');
        console.dir(error);
        return;
      }
      if (!result) {
        createSuperAdminRole(Role, function(error, role) {
          if (error) {
            console.log('Error creating SuperAdmin Role.');
            console.dir(error);
            return;
          }
          createDefaultAdmin(User, RoleMapping, ACL, role.id);
        });
      } else {
        createDefaultAdmin(User, RoleMapping, ACL, result.id);
      }
    });
  });
  createSuperAdminRole = function(Role, callback) {
    var role;
    role = {
      name: 'SuperAdmin',
      description: 'Super Admin'
    };
    Role.create(role, callback);
  };
  createDefaultAdmin = function(User, RoleMapping, ACL, roleId) {
    User.create(adminUser, function(error, user) {
      var BuiltInAccessTokenModel, BuiltInUserModel;
      if (error) {
        console.log('Error creating \'admin\' user.');
        console.dir(error);
        return;
      }
      RoleMapping.create({
        principalType: 'USER',
        principalId: user.getId(),
        roleId: roleId
      }, function(error, result) {
        if (error) {
          console.log('Error creating \'admin\' role mapping.');
          console.dir(error);
          return;
        }
        console.log('Created default \'admin\' user with password \'password\'.');
      });
      BuiltInUserModel = loopbackApplication.models['User'];
      ACL.create({
        model: BuiltInUserModel.definition.name,
        property: '*',
        accessType: '*',
        permission: 'ALLOW',
        principalType: 'ROLE',
        principalId: 'SuperAdmin'
      });
      BuiltInAccessTokenModel = loopbackApplication.models['AccessToken'];
      ACL.create({
        model: BuiltInAccessTokenModel.definition.name,
        property: '*',
        accessType: '*',
        permission: 'ALLOW',
        principalType: 'ROLE',
        principalId: 'SuperAdmin'
      });
      if (accessTokenModelName !== 'AccessToken') {
        ACL.create({
          model: AccessToken.definition.name,
          property: '*',
          accessType: '*',
          permission: 'ALLOW',
          principalType: 'ROLE',
          principalId: 'SuperAdmin'
        });
      }
      if (authModelName !== 'User') {
        ACL.create({
          model: User.definition.name,
          property: '*',
          accessType: '*',
          permission: 'ALLOW',
          principalType: 'ROLE',
          principalId: 'SuperAdmin'
        });
      }
    });
  };
};
