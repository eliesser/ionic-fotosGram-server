import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';

import uniqid from 'uniqid';

export default class FileSystem {
  constructor() {}

  guardarImagenTemporal(file: FileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      const path = this.crearCarpetaUsuario(userId);
      const nombreArchivo = this.generarNombreUnico(file.name);

      file.mv(`${path}/${nombreArchivo}`, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  private generarNombreUnico(nombreOrignal: string) {
    const nombreArr = nombreOrignal.split('.');
    const extension = nombreArr[nombreArr.length - 1];

    const idUnico = uniqid();

    return `${idUnico}.${extension}`;
  }

  private crearCarpetaUsuario(userId: string) {
    const pathUser = path.resolve(__dirname, '../uploads/', userId);
    const pathTemp = pathUser + '/temp';

    if (!fs.existsSync(pathUser)) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathTemp);
    }

    return pathTemp;
  }

  imagenesDeTempHaciaPost(userId: string) {
    const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
    const pathPost = path.resolve(__dirname, '../uploads/', userId, 'post');

    if (!fs.existsSync(pathTemp)) {
      return [];
    }

    if (!fs.existsSync(pathPost)) {
      fs.mkdirSync(pathPost);
    }

    const imagenesTemp = this.obtenerImagenesEnTemp(userId);

    imagenesTemp.forEach((imagen) => {
      fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
    });

    return imagenesTemp;
  }

  private obtenerImagenesEnTemp(userId: string) {
    const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
    return fs.readdirSync(pathTemp) || [];
  }

  getFotoUrl(userId: string, img: string) {
    const pathFoto = path.resolve(
      __dirname,
      '../uploads/',
      userId,
      'post',
      img
    );

    if (!fs.existsSync(pathFoto)) {
      return path.resolve(__dirname, '../assets/400x250.jpg');
    }

    return pathFoto;
  }
}
