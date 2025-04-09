import mongoose from "mongoose";

async function connect() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(mongoUri).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((err)=>{
        console.log(err);
    })
}

export default connect;