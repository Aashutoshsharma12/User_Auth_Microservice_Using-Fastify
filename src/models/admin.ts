import { model, Schema } from "mongoose";

interface admin {
    name: string;
    email: string;
    password: string;
    classId: any;
}

const schema = new Schema<admin>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    classId: { type: String, required: false }
},
    {
        timestamps: true
    });
const adminModel = model<admin>('admin', schema);
export = adminModel;