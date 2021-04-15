"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_1 = require("../models/usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRuoter = express_1.Router();
userRuoter.post(`/login`, (req, res) => {
    const body = req.body;
    usuario_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son conrrectos',
            });
        }
        if (bcrypt_1.default.compareSync(body.password, userDB.password)) {
            const token = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            return res.json({
                ok: true,
                token,
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son conrrectos',
            });
        }
    });
});
userRuoter.post(`/create`, (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
    };
    usuario_1.Usuario.create(user)
        .then((userDB) => {
        const token = token_1.default.getJwtToken({
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
userRuoter.put(`/update`, autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar,
    };
    usuario_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'nNo existe un usuario con ese ID',
            });
        }
        const token = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        res.json({
            ok: true,
            token,
        });
    });
});
userRuoter.get(`/`, autenticacion_1.verificaToken, (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario,
    });
});
exports.default = userRuoter;
