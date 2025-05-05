import bcrypt from 'bcrypt';

export default {
  async register(ctx) {
    const { email, password, username } = ctx.request.body;

    if (!email || !password || !username) {
      return ctx.badRequest('Email, username and password are required');
    }

    // Vérifie si l'email existe déjà
    const existing = await strapi.entityService.findMany('api::app-user.app-user', {
      filters: { Email: email },
    });

    if (existing.length > 0) {
      return ctx.badRequest('Email already in use');
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await strapi.entityService.create('api::app-user.app-user', {
      data: {
        Email: email,
        Username: username,
        Password: hashedPassword,
      },
      fields: ['id', 'Email', 'Username'],
    });

    return ctx.send({
      user: {
        id: newUser.id,
        email: newUser.Email,
        username: newUser.Username,
      },
    });
  },

  async login(ctx) {
    const { email, password } = ctx.request.body;

    const users = await strapi.entityService.findMany('api::app-user.app-user', {
      filters: { Email: email },
      fields: ['id', 'Email', 'Username', 'Password'],
    });

    const user = users[0];
    if (!user) {
      return ctx.unauthorized('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return ctx.unauthorized('Invalid credentials');
    }

    // Génération du token
    const token = strapi.plugins['users-permissions'].services.jwt.issue({
      id: user.id,
      email: user.Email,
    });

    return ctx.send({
      jwt: token,
      user: {
        id: user.id,
        email: user.Email,
        username: user.Username,
      },
    });
  },
};
