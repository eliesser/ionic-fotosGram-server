import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRuoter = Router();

userRuoter.post(`/login`, (req: Request, res: Response) => {
  const body = req.body;

  Usuario.findOne({ email: body.email }, (err: any, userDB: any) => {
    if (err) throw err;

    if (!userDB) {
      return res.json({
        ok: false,
        mensaje: 'Usuario/contraseña no son conrrectos',
      });
    }

    if (bcrypt.compareSync(body.password, userDB.password)) {
      const token = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      return res.json({
        ok: true,
        token,
      });
    } else {
      return res.json({
        ok: false,
        mensaje: 'Usuario/contraseña no son conrrectos',
      });
    }
  });
});

userRuoter.post(`/create`, (req: Request, res: Response) => {
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
  };

  Usuario.create(user)
    .then((userDB) => {
      const token = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({
        ok: true,
        token,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
});

userRuoter.put(`/update`, verificaToken, (req: any, res: Response) => {
  const user = {
    nombre: req.body.nombre || req.usuario.nombre,
    email: req.body.email || req.usuario.email,
    avatar: req.body.avatar || req.usuario.avatar,
  };

  Usuario.findByIdAndUpdate(
    req.usuario._id,
    user,
    { new: true },
    (err, userDB) => {
      if (err) throw err;

      if (!userDB) {
        return res.json({
          ok: false,
          mensaje: 'nNo existe un usuario con ese ID',
        });
      }

      const token = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({
        ok: true,
        token,
      });
    }
  );
});

userRuoter.get(`/`, verificaToken, (req: any, res: Response) => {
  const usuario = req.usuario;

  res.json({
    ok: true,
    usuario,
  });
});

export default userRuoter;
