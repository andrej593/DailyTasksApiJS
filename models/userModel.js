import { Schema, model, Types } from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    dateOfBirth: String,
    email: { type: String, required: true },
    phoneNumber: String,
    profilPicture: String,
    password: { type: String, required: true },
    authorityLvl: { type: Number, default: 0 },
    tasks: { type: [Types.ObjectId], ref: 'Task', required: true, default: [] }
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) next(err);
            else {
                bcrypt.hash(this.password, salt, (err, hash) => {
                    if (err) next(err);
                    else {
                        this.password = hash;
                        next();
                    }
                });
            }
        });
    } else next();
});


const User = model('User', userSchema);

export { User }

