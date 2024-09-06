import mongoose from "mongoose";

export const connectdatabase = async () => {
    try {
        const connect = await mongoose.connect('mongodb://localhost:27017/nextjsauthtut');
        return connect;
    } catch (error) {
        return error
    } 
}