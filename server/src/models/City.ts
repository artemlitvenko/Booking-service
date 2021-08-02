import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface ICity extends Document {
    city_name: string;
}

const CitySchema: Schema = new Schema({
    city_name: { type: String, required: true, unique: true },
});

export const CityModel = mongoose.model<ICity>('City', CitySchema);
