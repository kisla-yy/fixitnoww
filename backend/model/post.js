const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  titleImage: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: true
  }
});

module.exports = mongoose.model("post", PostSchema);