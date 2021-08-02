import dotenv from 'dotenv';
import path from 'path';

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('../.env') });

export default {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};
