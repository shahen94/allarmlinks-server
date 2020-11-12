import { NextFunction, Request, Response } from "express";
import { connectNewTagsToVolunteer, connectTagsToVolunteer, containsIds, getAllTags } from "../tags/tags.service";
import { IVolunteer, STATUS_FINISHED } from "../volunteer.model";
import { updateWithAdditionalData } from "../volunteer.service";
import { getDB } from "../../../lib/dbConnection";
import AppError from "../../../errors/AppError";
import { getDecoded } from "../../../utils/tokenUtils";

export const getAllAvailableTags = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(await getAllTags());
};

export const acceptVolunteerAdditionalData = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    const addedTags = req.body.addedTags as string[];

    console.log(addedTags);

    const decoded = getDecoded(token);

    const data = req.body as IVolunteer;
    data._id = decoded.id;

    // @ts-ignore
    const session = await getDB().startSession();
    session.startTransaction();

    try {
        await updateWithAdditionalData(data, session);
        await connectNewTagsToVolunteer(data._id, addedTags, session);
    } catch (err) {
        await session.abortTransaction();
        throw err;
    }

    await session.commitTransaction();
    res.status(200).json({
        status: STATUS_FINISHED
    })

};