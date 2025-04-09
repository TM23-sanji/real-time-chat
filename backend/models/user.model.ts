import mongoose, {Model,Document, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
    name:string;
    email:string;
    password:string;
    isValidPassword(password:string):Promise<boolean>;
    generateJWT():string;
}

interface IUserModel extends Model<IUser>{
    hashPassword(password:string):Promise<string>;
}

const userSchema:Schema = new Schema<IUser>({
    name:{type:String, required:[true, 'Name is required'], unique:true},
    email:{type:String, required:[true, 'Email is required'], unique:true, lowercase:true, minlength:[6, 'Email must be at least 6 characters'], maxlength:[32, 'Email must be at most 32 characters']},
    password:{type:String, required:[true, 'Password is required'], select:false},
})

userSchema.statics.hashPassword = async function(password:string):Promise<string>{
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword =async function(password:string):Promise<boolean>{
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = async function(){
    return jwt.sign({id:this._id,email:this.email},process.env.JWT_SECRET as string,{expiresIn:'7d'});
}

const User = mongoose.model<IUser,IUserModel>('user',userSchema);
export default User;