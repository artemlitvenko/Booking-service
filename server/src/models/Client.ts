import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export let ObjectId = Schema.Types.ObjectId;
export let Date = Schema.Types.Date;

export interface IClient extends Document {
    client_name: string;
    client_email: string;
    client_order: string;
}

const ClientSchema: Schema = new Schema({
    client_name: { type: String, required: true },
    client_email: { type: String, required: true, unique: true },
    client_order: [{ type: ObjectId, ref: 'Order' }],
});

export const ClientModel = mongoose.model<IClient>('Client', ClientSchema);
