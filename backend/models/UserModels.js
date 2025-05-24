import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/passwordHandler.js'; // Import our password utilities

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['customer', 'merchant', 'admin'],
      default: 'customer',
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// --- Password Hashing Middleware (using our utility) ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // Use our utility function to hash the password
  this.password = await hashPassword(this.password);
  next();
});

// --- Method to Compare Passwords (using our utility) ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use our utility function to compare the password
  return await comparePassword(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;