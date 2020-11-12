import mongoose from "mongoose";

let connection: typeof mongoose;

export function getDB() {
    return connection;
}

const connectDb = async (): Promise<void> => {
    const conn = await mongoose.connect(`${process.env.MONGO_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    connection = conn;
    console.log(`Mongo connected to ${conn.connection.host}`);
};

export default connectDb;
