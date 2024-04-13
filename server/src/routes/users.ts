import { Password } from '../services/password';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import jwt from 'jsonwebtoken';

import { validateRequest } from '../helpers/middleware/validate-request';
import { BadRequestError } from '../helpers/errors/bad-request-error';
import { currentUser } from '../helpers/middleware/current-user';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userjwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // req.session = {
    //   jwt: userjwt,
    // };

    // res.cookie('session', userjwt).status(201).send(user);
    res.status(201).send(user);
  }
);

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate JWT
    const userjwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // req.session = {
    //   jwt: userjwt,
    // };

    res.status(200).send({ userjwt });
  }
);

router.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as usersRouter };
