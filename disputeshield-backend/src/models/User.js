import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: [true, 'Store name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);