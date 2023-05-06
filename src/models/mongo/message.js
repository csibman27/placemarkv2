import Mongoose from "mongoose";

const { Schema } = Mongoose;

const messageSchema = new Schema({
  messageText: String,
  messageid: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
});

export const Message = Mongoose.model("Message", messageSchema);
