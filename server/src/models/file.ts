import mongoose from 'mongoose';
// An interface that describes the properties
// that are required to create a new File
interface FileAttrs {
  name: string;
  todoId: string;
}

// An interfaces that describes the properties
// that a File Model has
interface FileModel extends mongoose.Model<FileDoc> {
  build(attrs: FileAttrs): any;
}

// An interfaces that describes the properties
// that a File Document has
interface FileDoc extends mongoose.Document {
  name: string;
  todoId: string;
}

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    todoId: {
      type: String,
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

fileSchema.statics.build = (attrs: FileAttrs) => {
  return new File(attrs);
};

const File = mongoose.model<FileDoc, FileModel>('File', fileSchema);

export { File };
