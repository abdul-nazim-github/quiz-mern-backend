/**
 * User Model
 *
 * This model handles user account data, authentication, and role-based access.
 */

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface representing the User Document in MongoDB
 * Defines the structure for TypeScript type safety.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  status: 0 | 1;           // 1 = Active, 0 = Inactive
  created_at: Date;
  updated_at: Date | null;
  /**
   * Checks if the user has an admin role.
   */
  isAdmin(): boolean;
  /**
   * Compares a plain text password with the hashed password in DB.
   */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Security: Prevents password from being returned in API responses by default
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1, // 1 = active, 0 = inactive
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false // We are handling timestamps manually to satisfy the null requirement
  }
);

/**
 * Middleware: Update 'updated_at' on updates
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.updated_at = new Date();
  }
  next();
});

// For update queries (findByIdAndUpdate, updateOne, etc.)
UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});

UserSchema.pre('updateOne', function (next) {
  this.set({ updated_at: new Date() });
  next();
});

/**
 * Pre-save Hook: Password Hashing
 *
 * Automatically runs before every .save() or .create() call.
 * If the password field is modified, it hashes it using bcrypt.
 */
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Instance Method: isAdmin
 * Returns true if the user's role is 'admin'.
 */
UserSchema.methods.isAdmin = function (): boolean {
  return this.role === 'admin';
};

/**
 * Instance Method: comparePassword
 * Uses bcrypt to compare a provided string with the hashed value in the DB.
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
