import mongoose, {Model,Types, Document, Schema} from "mongoose";

export interface IProject extends Document {
    name:string;
    users:Types.ObjectId[];
}

const projectSchema:Schema = new Schema({
    name:{type:String, lowercase:true, required:[true, 'Name is required'], unique:[true,'Project Name must be Unique'], trim:true},
    users:[{
        type:Schema.Types.ObjectId,
        ref:'user'
    }]
})

const Project = mongoose.model<IProject>('project',projectSchema);
export default Project