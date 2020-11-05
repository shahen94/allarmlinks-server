import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

export interface ITag extends Document {
    name: string,
}

const TagSchema: Schema = new mongoose.Schema({
    name: {type: String, required: true}
});

export interface IVolunteerTag extends Document {
    volunteerId: string
    tagId: string
}

const VolunteerTagSchema: Schema = new mongoose.Schema({
    volunteerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true},
    tagId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag', unique: true, required: true},
});

export const Tag = mongoose.model<ITag>("Tag", TagSchema);
export const VolunteerTag = mongoose.model<IVolunteerTag>("VolunteerTag", VolunteerTagSchema);