const validator = require('validator');
const db = require('../../db');

async function inviteUser(req, res, next) {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  if (!email.endsWith('@sergas.es')) {
    return res.status(400).json({
      error: 'Solo se permiten correos @sergas.es',
    });
  }

  try {
    const query = `
      INSERT INTO users (email, name, role)
      VALUES ($1, 'Sanitario Pendiente', 'clinico')
      RETURNING id, email, role
    `;

    const result = await db.query(query, [email]);

    return res.status(201).json({
      message: 'Usuario dado de alta correctamente. Pendiente de activación.',
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Este usuario ya existe en la base de datos.',
      });
    }

    return next(error);
  }
}

module.exports = {
  inviteUser,
};