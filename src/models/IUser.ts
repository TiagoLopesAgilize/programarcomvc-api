export interface IUser {
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
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
    id?:String,
    login?: String,
    name?: String,
    timestamp: Date
}