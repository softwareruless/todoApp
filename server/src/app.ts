import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
const cors = require('cors');

import { NotFoundError } from './helpers/errors/not-found-error';
import { errorHandler } from './helpers/middleware/error-handler';
import { currentUser } from './helpers/middleware/current-user';

import { todosRouter } from './routes/todos';
import { usersRouter } from './routes/users';

const app = express();
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(json({ limit: '5mb' }));
app.use(cors());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
  // process.env.NODE_ENV !== 'test'
);

app.use(currentUser);
app.use(usersRouter);
app.use(todosRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
