import mongoose from 'mongoose'

const characterSchema = new mongoose.Schema({
    character: {
        type: String,
        required: false,
    },
    moves: [{
        type: Object
    }]
}, { timestamps: true });

export default mongoose.model('Character', characterSchema, 'character')