import {NextFunction, Request, Response} from "express";
import {
    connectNewTagsToVolunteer,
    connectTagsToVolunteer,
    containsIds,
    getAllTags
} from "../tags/tags.service";
import {IVolunteer} from "../volunteer.model";
import {updateWithAdditionalData} from "../volunteer.service";
import * as mongoose from "mongoose";

export const getAllAvailableTags = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(await getAllTags());
};

export const acceptVolunteerAdditionalData = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as IVolunteer;
    const defaultTagsId = req.body.defaultTagsId as string[];
    const addedTags = req.body.addedTags as string[];

    const session = await mongoose.startSession();
    session.startTransaction();

    await containsIds(defaultTagsId)
        .then(() => updateWithAdditionalData(data, session))
        .then(() => connectTagsToVolunteer(data._id, defaultTagsId, session))
        .then(() => connectNewTagsToVolunteer(data._id, addedTags, session))
        .then(() => res.status(200).json())
        .catch(err => {
            session.abortTransaction();
            return err;
        });

    res.status(200).json();
};