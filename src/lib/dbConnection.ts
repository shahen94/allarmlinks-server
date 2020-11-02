const mongoose = require("mongoose");
const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(`Mongo connected to ${conn.connection.host}`);
};

export default connectDb;
