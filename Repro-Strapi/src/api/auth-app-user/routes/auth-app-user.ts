export default {
    routes: [
      {
        method: 'POST',
        path: '/auth-app/register',
        handler: 'auth-app-user.register',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/auth-app-user/login',
        handler: 'auth-app-user.login',
        config: {
          policies: [],
          auth: false,
        },
      },
    ],
  };
  