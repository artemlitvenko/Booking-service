import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export let ObjectId = Schema.Types.ObjectId;
export let Date = Schema.Types.Date;

export interface IOrder extends Document {
    master: string;
    client: string;
    city: string;
    size: number;
    start_time: Date;
    end_time: Date;
}

const OrderSchema: Schema = new Schema({
    master: { type: ObjectId, ref: 'Master' },
    client: { type: ObjectId, ref: 'Client' },
    city: { type: ObjectId, ref: 'City' },
    size: { type: Number, default: 20 },
    start_time: { type: Date },
    end_time: { type: Date },
});

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
