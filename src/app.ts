import * as express from 'express';
import * as cors from 'cors';
import userRouter from 'src/routes/user.routes';
import errorHandler from 'src/middlewares/error.handler';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({
    status: true,
    message: 'Server Started Suceessfully',
  });
});

app.use('/api/user', userRouter);
app.use(errorHandler);

export default app;
