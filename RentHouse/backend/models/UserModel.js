import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo:{
        type: String,
        required: true,
    },
    isManager:{
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.pre('save', async function(next){
   const user = this;
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password, 8);
   }
});

const User = mongoose.model('User', userSchema);

export default User;