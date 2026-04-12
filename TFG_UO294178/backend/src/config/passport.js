const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../../db');

function configurePassport(app) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

          if (result.rows.length === 0) {
            return done(null, false, { message: 'Credenciales no válidas.' });
          }

          const user = result.rows[0];

          if (!user.active) {
            return done(null, false, { message: 'Cuenta pendiente de activación.' });
          }

          if (!user.password) {
            return done(null, false, { message: 'Error de cuenta: contacte con soporte.' });
          }

          const validPassword = await bcrypt.compare(password, user.password);

          if (!validPassword) {
            return done(null, false, { message: 'Credenciales no válidas.' });
          }

          const { password: _, ...safeUser } = user;
          return done(null, safeUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query(
        'SELECT id, email, role, name, active FROM users WHERE id = $1',
        [id]
      );

      done(null, result.rows[0] || null);
    } catch (error) {
      done(error, null);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = configurePassport;