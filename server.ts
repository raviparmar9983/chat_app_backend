import * as config from 'config';
import connection from 'src/db/db.connection';
import app from './src/app';

connection();
const PORT = config.get('PORT');

const server = app.listen(PORT, () => {
  console.info(`Server Started On ${PORT}`);
});
