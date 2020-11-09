import {CreateVolunteerTag, Tag, VolunteerTag} from "./tags.model";
import AppError from "../../../errors/AppError";
import mongoose, {ClientSession} from "mongoose";
import {existsVolunteerById} from "../volunteer.service";

export const addTag = async (name: string) => {
    let tag = await findTagByName(name);

    if (!tag) {
        tag = await Tag.create({
            name: name
        });
    }

    return tag;
};

export const getTagByName = async (name: string) => {
    const tag = await findTagByName(name);
    if (!tag)
        throw new AppError(500, "Can't get tag");

    return tag;
}

export const findTagByName = async (name: string) => {
    return Tag.findOne({name: name});
}

export const connectNewTagToVolunteer = async (volunteerId: string, name: string, session: ClientSession) => {
    const tag = await addTag(name);
    return await connectTagToVolunteer(volunteerId, tag._id, session);
}

export const connectTagToVolunteer = async (volunteerId: string, tagId: string, session: ClientSession) => {
    await VolunteerTag.create([{
        volunteerId: volunteerId,
        tagId: tagId
    }], {
        session: session
    })
        // ignore duplicate errors
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000)
                return;
            throw err;
        });
}

export const connectNewTagsToVolunteer = async (volunteerId: string, tagNames: string[], session: ClientSession) => {
    if (!await existsVolunteerById(volunteerId))
        throw new AppError(400, "Volunteer doesn't exist.");

    for (const name of tagNames) {
        await connectNewTagToVolunteer(volunteerId, name, session);
    }
}

export const connectTagsToVolunteer = async (volunteerId: string, tagIds: string[], session: ClientSession) => {
    if (!await existsVolunteerById(volunteerId))
        throw new AppError(400, "Volunteer doesn't exist.");

    const entries: CreateVolunteerTag[] = [];
    tagIds.forEach((id) => entries.push({
        volunteerId: volunteerId,
        tagId: id
    }));

    return VolunteerTag.create(entries, {session: session});
}

const getTagsPipeline = (volunteerId: string) => {
    return [
        {
            "$project": {
                "_id": 0,
                "volunteertags": "$$ROOT"
            }
        },
        {
            "$lookup": {
                "localField": "volunteertags.tagId",
                "from": "tags",
                "foreignField": "_id",
                "as": "tags"
            }
        },
        {
            "$unwind": {
                "path": "$tags",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$match": {
                "volunteertags.volunteerId": new mongoose.mongo.ObjectId(volunteerId)
            }
        },
        {
            "$project": {
                "_id": "$tags._id",
                "name": "$tags.name",
            }
        }
    ];
}

export const getTagsForVolunteer = (volunteerId: string) => {
    return VolunteerTag.aggregate(getTagsPipeline(volunteerId));
};

export const getAllTags = () => {
    return Tag.find({});
}

export const containsIds = async (tagIds: string[]): Promise<boolean> => {
    const tags = await Tag.find({_id: {$in: tagIds}});
    return (tagIds.length === 0 && !tags) || tags.length === tagIds.length;
}