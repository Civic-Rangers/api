import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  first_name: string;
  last_name: string;
  address_street: string;
  address_state: string;
  address_zip: string;
  address_city: string;
  phone: string;
  email: string;
  dob: Date;
  password: string;
  role: "seekers" | "donor";
  biography: string;
  photo_id: string;
}

const UserSchema = new Schema<IUser>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address_street: { type: String, required: true },
  address_state: { type: String, required: true },
  address_zip: { type: String, required: true },
  address_city: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["seekers", "donor"], required: true },
  biography: { type: String },
  photo_id: { type: String },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err: any) {
    next(err);
  }
});

const User = model<IUser>("User", UserSchema);

export default User;
