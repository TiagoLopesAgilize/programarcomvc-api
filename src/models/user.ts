 
//REF: http://blog.slatepeak.com/refactoring-a-basic-authenticated-api-with-node-express-and-mongo/
import { compareSync, genSaltSync, genSalt, hashSync, compare, hash } from 'bcrypt-nodejs';
import { Document, Schema, Model, model } from 'mongoose';

import { IUser } from './IUser';

export interface IUserModel extends IUser, Document {
  fullName(): string;
}

export var UserSchema: Schema = new Schema({
    login: String,
    name: String,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        firstName: { type: String },
        lastName: { type: String }
    },
    role: {
        type: String,
        enum: ['Member', 'Client', 'Owner', 'Admin'],
        default: 'Member'
    },
    idEmpresa: String,
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    timestamp: Date,
});

// methods ======================
// generating a hash
this.UserSchema.methods.generateHash = function (password) {
    return hashSync(password, this.genSaltSync(8));
};
// checking if password is valid
this.UserSchema.methods.validPassword = function (password) {
    return compareSync(password, this.local.password);
};
 
// Pre-save of user to database, hash password if password is modified or new
this.UserSchema.pre('save', function(next) {  
  const user = this, SALT_FACTOR = 5;

  if (!user.isModified('password')) { 
      return next()
  };

  genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
this.UserSchema.methods.comparePassword = function(candidatePassword, cb) {  
    compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);

 // module.exports = model('User', this.UserSchema);