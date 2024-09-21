import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  address_street: string;
  address_state: string;
  address_zip: string;
  address_city: string;
  phone: string;
  email: string;
  dob: Date;
  password: string | undefined;
  role: "seekers" | "donor";
  biography: string;
  photo_id: string;
  lat: number;
  lon: number;
  correctPassword: (
    requestPassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address_street: { type: String, required: true },
    address_state: { type: String, required: true },
    address_zip: { type: String, required: true },
    address_city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["seekers", "donor"], required: true },
    biography: { type: String },
    photo_id: { type: String },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password as string, 12);
    }
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

UserSchema.methods.correctPassword = async function (
  requestPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(requestPassword, userPassword);
};

const User = model<IUser>("User", UserSchema);

export default User;
