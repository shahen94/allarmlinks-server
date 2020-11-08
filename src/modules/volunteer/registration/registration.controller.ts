import {NextFunction, Request, Response} from "express";
import {connectNewTagsToVolunteer, connectTagsToVolunteer, containsIds, getAllTags} from "../tags/tags.service";
import {IVolunteer, STATUS_FINISHED} from "../volunteer.model";
import {updateWithAdditionalData} from "../volunteer.service";
import {getDB} from "../../../lib/dbConnection";
import jwt from "jsonwebtoken";
import AppError from "../../../errors/AppError";

export const getAllAvailableTags = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(await getAllTags());
};

export const acceptVolunteerAdditionalData = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;

    const decoded: any = jwt.verify(
        token,
        `${process.env.JWT_SECRET_KEY}`
    );

    const data = req.body as IVolunteer;
    data._id = decoded.id;

    const tagIds = req.body.tagIds as string[];
    const addedTags = req.body.addedTags as string[];

    // @ts-ignore
    const session = await getDB().startSession();
    session.startTransaction();

    try {
        if (!await containsIds(tagIds))
            throw new AppError(400, "Tags are incorrect");

        await updateWithAdditionalData(data, session);
        await connectTagsToVolunteer(data._id, tagIds, session);
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