import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import Server from './classes/server';

import userRuoter from './routes/usuario';
import postRuoter from './routes/post';

const server = new Server();

server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

server.app.use(fileUpload({ useTempFiles: true }));

server.app.use(cors({ origin: true, credentials: true }));

server.app.use('/user', userRuoter);
server.app.use('/post', postRuoter);

mongoose.connect(
  'mongodb://localhost:27017/fotosgram',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;

    console.log('Base de datos Online');
  }
);

server.start(() => {
  console.log(`Servidor corriendo en el puerto ${server.port}`);
});
