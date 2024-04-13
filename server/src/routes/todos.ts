import express, { Request, Response } from 'express';
import { NotFoundError } from '../helpers/errors/not-found-error';
import { BadRequestError } from '../helpers/errors/bad-request-error';

import { requireAuth } from '../helpers/middleware/require-auth';

import { Todo } from '../models/todo';
import { File } from '../models/file';

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

import multer from 'multer';
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
      photo: { $nin: ['photo', '', null, undefined] },
    })
      .skip(perPage * page)
      .limit(perPage);
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
      console.log('result of photos', result);

      todosUpdated.map((x) => {
        x.photo = result.resources.filter(
          (a) => a.public_id == x.photo
        )[0]?.secure_url;
      });
      // console.log('todosUpdated', todosUpdated);

      res.status(200).send(todosUpdated);
    })
    .catch((error) => {
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
        throw new BadRequestError("Photo couldn't find");
      });
  }
);

//CREATE TODO
router.post('/api/todos', requireAuth, async (req: Request, res: Response) => {
  const { name } = req.body;

  const todo = Todo.build({
    name: name,
    description: '',
    photo: '',
    tags: [],
    userId: req.currentUser!.id,
    isFinished: false,
  });
  await todo.save();

  res.status(201).send(todo);
});

//UPDATE TODO
router.put(
  '/api/todos/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { name, description, tags } = req.body;

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

//Finish TODO
router.put(
  '/api/todos/:id/finished',
  requireAuth,
  async (req: Request, res: Response) => {
    const { isFinished } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    todo.set({
      isFinished: isFinished,
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

            throw new BadRequestError("Photo couldn't delete");
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
  upload.single('file'),
  requireAuth,
  async (req: Request, res: Response) => {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.currentUser.id,
    });

    if (!todo) {
      throw new NotFoundError();
    }

    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          type: 'authenticated',
        },
        async (error, result) => {
          if (error) {
            console.log(error);

            throw new BadRequestError("File couldn't upload");
          }

          const file = File.build({
            name: result.public_id,
            todoId: todo.id,
          });
          await file.save();

          res.status(200).send(file);
        }
      )
      .end(req.file.buffer);
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

    if (file.name) {
      cloudinary.uploader
        .destroy(file.name, {
          type: 'authenticated',
        })
        .then(async (result) => {
          if (result.error) {
            console.log(result.error);

            throw new BadRequestError("File couldn't delete");
          }

          await file.deleteOne();

          console.log('deleted');
        });
    } else {
      throw await new BadRequestError("File couldn't find");
    }

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

    var files = await File.find({ todoId: todo.id });

    var filesUpdated = files.map((x) => {
      return {
        name: x.name,
        id: x._id,
      };
    });

    cloudinary.api
      .resources_by_ids(
        filesUpdated.map((x) => x.name),
        {
          type: 'authenticated',
        }
      )
      .then((result) => {
        filesUpdated.map((x) => {
          x.name = result.resources.filter(
            (a) => a.public_id == x.name
          )[0]?.secure_url;
        });

        res.status(200).send(filesUpdated);
      })
      .catch((error) => {
        console.log('error 123', error);
        throw new BadRequestError("File couldn't find");
      });
  }
);

export { router as todosRouter };
