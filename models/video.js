import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
    player1: {
        type: String,
        required: true,
        trim: true,
      },
    
      player2: {
        type: String,
        required: true,
        trim: true,
      },
    
      char1: {
        type: String,
        required: true,
        trim: true,
      },
    
      char2: {
        type: String,
        required: true,
        trim: true,
      },
    
      assist1: {
        type: String,
        required: true,
        trim: true,
      },
    
      assist2: {
        type: String,
        required: true,
        trim: true,
      },
    
      link: {
        type: String,
        required: true,
        trim: true,
      },
    
      version: {
        type: String,
        required: true,
        trim: true,
      },
    
      matchDate: {
        type: String,
        required: true,
        trim: true,
      },
    
      owner: {
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: 'Account',
      },
    
      createdData: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });

export default mongoose.model('Video', videoSchema, 'videos')