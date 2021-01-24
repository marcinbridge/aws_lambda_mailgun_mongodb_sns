import * as mongoose from "mongoose";
import { MailgunDataBase } from "./mailgun-model";

export interface MailgunDataMongoModel
  extends MailgunDataBase,
    mongoose.Document {}
/**
 * Mailgun Schema
 */
let MailgunSchema = new mongoose.Schema({
  key: {
    type: String,
    trim: true,
    default: "",
    required: [true, "Key is required"],
    dropDups: true,
    unique: true,
  },
  signature: {
    type: Object,
    required: true,
  },
  "event-data": {
    type: Object,
    required: true,
  },
});

MailgunSchema.set("toJSON", {
  virtuals: true,
});

MailgunSchema.set("toObject", {
  virtuals: true,
});

const generateRandomKey = (baseString: string) => {
  let key;
  if (baseString) {
    key = baseString.replace(/\s+/g, "-").toLowerCase();
  }
  key = `${key}-${Math.floor(1000 + Math.random() * 9000)}`;
  return key;
};

/**
 * Hook a pre validate method to generate mailgun key
 */
MailgunSchema.pre<MailgunDataMongoModel>("validate", function (next) {
  this.key = generateRandomKey(this["event-data"].id);
  next();
});

// @ts-ignore
global.MailgunSchema =
  // @ts-ignore
  global.MailgunSchema ||
  mongoose.model<MailgunDataMongoModel>("Mailgun", MailgunSchema);

// @ts-ignore
export default global.MailgunSchema;
