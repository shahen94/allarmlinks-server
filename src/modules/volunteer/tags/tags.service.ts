import { CreateVolunteerTag, Tag, VolunteerTag } from "./tags.model";
import AppError from "../../../errors/AppError";
import { ClientSession } from "mongoose";
import { existsVolunteerById } from "../volunteer.service";
import { STATUS_FINISHED } from "../volunteer.model";

const mongoose = require("mongoose");

export const addTag = async (name: string) => {
    let tag = await findTagByName(name);

    if (!tag) {
        tag = await Tag.create({
            name: name.toLowerCase()
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
    return Tag.findOne({ name: name });
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

    return VolunteerTag.create(entries, { session: session });
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
export const getVolunteersForTagsPipeline = (tags: string[]) => {
    return [
        { 
            "$project" : { 
                "_id" : 0, 
                "tags" : "$$ROOT"
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "tags._id", 
                "from" : "volunteertags", 
                "foreignField" : "tagId", 
                "as" : "volunteertags"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$volunteertags", 
                "preserveNullAndEmptyArrays" : true
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "volunteertags.volunteerId", 
                "from" : "volunteers", 
                "foreignField" : "_id", 
                "as" : "volunteers"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$volunteers", 
                "preserveNullAndEmptyArrays" : true
            }
        }, 
        { 
            "$match" : {
                "$and":[
                    { 
                        "tags.name" : "Programming"
                    }   ,
                    {
                        "volunteers.status" : STATUS_FINISHED
                    }
                ]
            }
        }, 
        { 
            "$project" : { 
                "volunteers.name" : "$volunteers.name", 
                "volunteers.surname" : "$volunteers.surname", 
                "volunteers.email" : "$volunteers.email", 
                "volunteers.phone" : "$volunteers.phone", 
                "volunteers.birthDate" : "$volunteers.birthDate", 
                "volunteers.country" : "$volunteers.country", 
                "volunteers.city" : "$volunteers.city", 
                "volunteers.address" : "$volunteers.address", 
                "volunteers.specialization" : "$volunteers.specialization", 
                "volunteers.currentEmployerName" : "$volunteers.currentEmployerName", 
                "volunteers.occupation" : "$volunteers.occupation", 
                "volunteers.languages" : "$volunteers.languages", 
                "volunteers.hoursPerWeek" : "$volunteers.hoursPerWeek", 
                "volunteers.workStatus" : "$volunteers.workStatus", 
                "volunteers.facebookProfile" : "$volunteers.facebookProfile", 
                "volunteers.linkedinProfile" : "$volunteers.linkedinProfile", 
                "volunteers.twitterProfile" : "$volunteers.twitterProfile", 
                "volunteers.whereToVolunteer" : "$volunteers.whereToVolunteer", 
                "volunteers.other" : "$volunteers.other", 
                "volunteers._id" : "$volunteers._id",
            }
        }
    ] 

}
export const getVolunteersForTags = (tags: string[]) => {
    return Tag.aggregate(getVolunteersForTagsPipeline(tags))
}
export const getTagsForVolunteer = (volunteerId: string) => {
    return VolunteerTag.aggregate(getTagsPipeline(volunteerId));
};

export const getAllTags = () => {
    return Tag.find({});
}

export const containsIds = async (tagIds: string[]): Promise<boolean> => {
    const tags = await Tag.find({ _id: { $in: tagIds } });
    return (tagIds.length === 0 && !tags) || tags.length === tagIds.length;
}