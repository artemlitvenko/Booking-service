import mongoose from 'mongoose';
import config from './config';
import { app } from './app';

const mongo = config.MONGO_URL;

const start = async () => {
    try {
        await mongoose.connect(`${mongo}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        app.listen(config.PORT, () => {
            console.log('Server started on port ', config.PORT);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
