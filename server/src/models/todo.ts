import mongoose from 'mongoose';
// An interface that describes the properties
// that are required to create a new Todo
interface TodoAttrs {
  name: string;
  description: string;
  photo: string;
  tags: string[];
  userId: string;
  isFinished: boolean;
}

// An interfaces that describes the properties
// that a Todo Model has
interface TodoModel extends mongoose.Model<TodoDoc> {
  build(attrs: TodoAttrs): any;
}

// An interfaces that describes the properties
// that a Todo Document has
interface TodoDoc extends mongoose.Document {
  name: string;
  description: string;
  photo: string;
  tags: string[];
  userId: string;
  isFinished: boolean;
}

const todoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    userId: {
      type: String,
      required: true,
    },
    isFinished: {
      type: Boolean,
      required: true,
    },
  },
  {
    // for create pure json file
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

todoSchema.statics.build = (attrs: TodoAttrs) => {
  return new Todo(attrs);
};

const Todo = mongoose.model<TodoDoc, TodoModel>('Todo', todoSchema);

export { Todo };
