import * as mongoose from "mongoose";
// tslint:disable-next-line:promise-function-async
export const startMongoose = (): Promise<mongoose.Mongoose> => {
  // Mongoose uses global Promise by default
  const options = {
    connectTimeoutMS: 3000,
    socketTimeoutMS: 3000,
    poolSize: 15, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    bufferCommands: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  const mongoURL = String(process.env.MONGO_DB_URL);
  return new Promise((resolve, reject) => {
    mongoose.set("bufferCommands", false);
    mongoose.connect(mongoURL, options, (err) => {
      if (err) {
        return reject(err);
      }
      // @ts-ignore
      return resolve();
    });
  });
};

// export const stoptMongoose = async (): Promise<void> => {
//   await mongoose.connection.close();
// };
