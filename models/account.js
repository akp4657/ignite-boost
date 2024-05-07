import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[A-Za-z0-9_\-.]{1,16}$/,
      },
      salt: {
        type: Buffer,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      createdDate: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });

export default mongoose.model('Account', accountSchema, 'account')