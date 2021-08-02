import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export let ObjectId = Schema.Types.ObjectId;

export interface IMaster extends Document {
    name: string;
    rating: string;
    city: string;
    order: string;
}

const MasterSchema: Schema = new Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    city: { type: ObjectId, ref: 'City' },
    order: [{ type: ObjectId, ref: 'Order' }],
});

export const MasterModel = mongoose.model<IMaster>('Master', MasterSchema);
