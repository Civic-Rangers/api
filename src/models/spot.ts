import { Schema, model, Types } from 'mongoose';

const spotSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  spaces: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['full', 'available', 'disabled'],
    required: true
  },
  application_accepted: [{
    type: Types.ObjectId,
    ref: 'Application'
  }],
  application_pending: [{
    type: Types.ObjectId,
    ref: 'Application'
  }],
  photo_id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  suggestions: {
    type: String,
    required: true
  }
});

const Spot = model('Spot', spotSchema);

export default Spot;