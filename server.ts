import * as config from 'config';
import * as express from 'express';
import connection from 'src/db/db.connection';
import * as cors from 'cors';
import app from './src/app';

connection();
const PORT = config.get('PORT');

app.listen(PORT, () => {
  console.info(`Server Started On ${PORT}`);
});
