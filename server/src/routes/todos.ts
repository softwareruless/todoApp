import express, { Request, Response } from 'express';
import { NotFoundError } from '../helpers/errors/not-found-error';
import { BadRequestError } from '../helpers/errors/bad-request-error';

import { requireAuth } from '../helpers/middleware/require-auth';

import { Todo } from '../models/todo';
import { File } from '../models/file';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

import multer from 'multer';
import { totalmem } from 'os';
import { error } from 'console';
const upload = multer();

const router = express.Router();

//GET TODOS
router.get('/api/todos', requireAuth, async (req: Request, res: Response) => {
  const { search, page = 0 } = req.body;

  var todos;
  var perPage = 10;

  if (search) {
    todos = await Todo.find({
      userId: req.currentUser.id,
      $or: [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: new RegExp(search, 'i') } },
      ],
      photo: { $nin: ['photo', ''] },
    })
      .limit(perPage)
      .skip(perPage * page);
  } else {
    todos = await Todo.find({
      userId: req.currentUser.id,
      photo: { $nin: ['photo', '', null, undefined] },
    })
      .skip(perPage * page)
      .limit(perPage);
  }

  if (!todos) {
    throw new NotFoundError();
  }

  var todosUpdated = todos.map((x) => {
    return {
      photo: x.photo,
      name: x.name,
      description: x.description,
      tags: x.tags,
      id: x._id,
    };
  });

  cloudinary.api
    .resources_by_ids(
      todosUpdated.map((x) => x.photo),
      {
        type: 'authenticated',
      }
    )
    .then((result) => {
      todosUpdated.map((x) => {
        x.photo = result.resources.filter(
          (a) => a.public_id == x.photo
        )[0]?.secure_url;
      });

      res.status(200).send(todosUpdated);
    })
    .catch((error) => {
      console.log('error 123', error);
      throw new BadRequestError("Photo couldn't find");
    });
});

//GET TODO DETAIL
router.get(
  '/api/todos/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    }).populate('tags');

    if (!todo) {
      throw new NotFoundError();
    }

    cloudinary.api
      .resource(todo.photo, {
        type: 'authenticated',
      })
      .then((result) => {
        var updatedTodo = {
          photo: result.secure_url,
          name: todo.name,
          description: todo.description,
          tags: todo.tags,
          id: todo._id,
        };

        res.status(200).send(updatedTodo);
      })
      .catch((error) => {
        console.log('error 123', error);
        throw new BadRequestError("Photo couldn't find");
      });
  }
);

//CREATE TODO
router.post('/api/todos', requireAuth, async (req: Request, res: Response) => {
  const { name, description, tags } = req.body;

  const todo = Todo.build({
    name: name,
    description: description,
    photo: '',
    tags: tags,
    userId: req.currentUser!.id,
  });
  await todo.save();

  res.status(201).send(todo);
});

//UPDATE TODO
router.put(
  '/api/todos/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { name, description, photo, tags } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    todo.set({
      name: name,
      description: description,
      tags: tags,
    });

    await todo.save();

    res.status(200).send(todo);
  }
);

//DELETE TODO
router.delete(
  '/api/todos/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    const files = File.find({ todoId: req.params.id });

    if (!files) {
      throw new NotFoundError();
    }

    if (todo.photo) {
      cloudinary.uploader.destroy(todo.photo, {
        type: 'authenticated',
      });
    }

    await todo.deleteOne();
    await files.deleteMany();
    //can getting error. test it

    res.status(200).send();
  }
);

//PUT PHOTO
router.put(
  '/api/todos/:id/photo',
  upload.single('photo'),
  requireAuth,
  async (req: Request, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.photo) {
      cloudinary.uploader.destroy(todo.photo, {
        type: 'authenticated',
      });
    }

    await cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          type: 'authenticated',
        },
        async (error, result) => {
          if (error) {
            console.log(error);

            throw new BadRequestError("Photo couldn't upload");
          }

          todo.set({
            photo: result.public_id,
          });

          await todo.save();

          res.status(200).send();
        }
      )
      .end(req.file.buffer);
  }
);

//DELETE PHOTO
router.delete(
  '/api/todos/:id/photo',
  requireAuth,
  async (req: Request, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.photo) {
      cloudinary.uploader
        .destroy(todo.photo, {
          type: 'authenticated',
        })
        .then(async (result) => {
          if (result.error) {
            console.log(result.error);

            throw new BadRequestError("Photo couldn't upload");
          }

          todo.set({
            photo: '',
          });

          await todo.save();

          res.status(200).send(todo);
        });
    }

    throw new NotFoundError();
  }
);

//CREATE FILE
router.post(
  '/api/todos/:id/files',
  requireAuth,
  async (req: Request, res: Response) => {
    const { name } = req.body;

    // TODO: storage files

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    const file = File.build({
      name: name,
      todoId: todo.id,
    });
    await file.save();

    res.status(201).send(file);
  }
);

//DELETE FILE
router.delete(
  '/api/todos/:id/files/:fileId',
  requireAuth,
  async (req: Request, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    const file = await File.findOne({
      _id: req.params.fileId,
      todoId: todo._id,
    });

    if (!file) {
      throw new NotFoundError();
    }

    await file.deleteOne();
    // await todo.save();

    res.status(200).send();
  }
);

//GET FILES
router.get(
  '/api/todos/:id/files',
  requireAuth,
  async (req: Request, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    var files = File.find({ todoId: todo.id });

    res.status(200).send(files);
  }
);

export { router as todosRouter };
