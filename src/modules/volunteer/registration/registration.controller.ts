import {NextFunction, Request, Response} from "express";
import {
    connectNewTagsToVolunteer,
    connectTagsToVolunteer,
    containsIds,
    getAllTags
} from "../tags/tags.service";
import {IVolunteer, STATUS_FINISHED} from "../volunteer.model";
import {updateWithAdditionalData} from "../volunteer.service";
import * as mongoose from "mongoose";
import {getDB} from "../../../lib/dbConnection";

export const getAllAvailableTags = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(await getAllTags());
};

export const acceptVolunteerAdditionalData = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as IVolunteer;
    const token = req.params.token;

    const defaultTagsId = req.body.defaultTagsId as string[];
    const addedTags = req.body.addedTags as string[];

    // @ts-ignore
    const session = await getDB().startSession();
    session.startTransaction();

    await containsIds(defaultTagsId)
        .then(() => updateWithAdditionalData(data, session))
        .then(() => connectTagsToVolunteer(data._id, defaultTagsId, session))
        .then(() => connectNewTagsToVolunteer(data._id, addedTags, session))
        .catch(err => {
            session.abortTransaction();
            return err;
        });

    res.status(200).json({
        status: STATUS_FINISHED
    });
};