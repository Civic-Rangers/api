import { Schema, model, Types } from "mongoose";
import { IUser } from "./user.model";
import { IApplication } from "./application.model";

interface ISpot extends Document {
  user_id: IUser;
  spaces?: number;
  status: "full" | "available" | "disabled";
  application_accepted?: IApplication[];
  application_pending?: IApplication[];
  photo_id: string;
  description: string;
  suggestions: string;
}

const spotSchema = new Schema<ISpot>(
  {
    user_id: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    spaces: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["full", "available", "disabled"],
      default: "available",
    },
    application_accepted: [
      {
        type: Types.ObjectId,
        ref: "Application",
      },
    ],
    application_pending: [
      {
        type: Types.ObjectId,
        ref: "Application",
      },
    ],
    photo_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    suggestions: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Spot = model("Spot", spotSchema);

export default Spot;
