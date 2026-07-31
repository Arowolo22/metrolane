import argon2 from "argon2"
import { Schema, model, type Document, type Types } from "mongoose"

export interface IUser {
  firstName: string
  lastName: string
  department: string
  email: string
  phone: string
  passwordHash: string
  role: "lecturer" | "admin"
  isActive: boolean
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId
  comparePassword(candidate: string): Promise<boolean>
  fullName: string
}

const userSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["lecturer", "admin"], default: "lecturer" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

userSchema.virtual("fullName").get(function fullName(this: IUserDocument) {
  return `${this.firstName} ${this.lastName}`
})

userSchema.methods.comparePassword = async function comparePassword(
  candidate: string,
): Promise<boolean> {
  return argon2.verify(this.passwordHash, candidate)
}

userSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret: any) {
    delete ret.passwordHash
    delete ret.__v
    return ret
  },
})

export const User = model<IUserDocument>("User", userSchema)

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password)
}
