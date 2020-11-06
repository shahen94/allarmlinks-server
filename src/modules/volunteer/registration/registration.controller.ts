import {NextFunction, Request, Response} from "express";
import {
    connectNewTagsToVolunteer,
    connectTagsToVolunteer,
    containsIds,
    getAllTags
} from "../tags/tags.service";
import {IVolunteer} from "../volunteer.model";
import {updateWithAdditionalData} from "../volunteer.service";

export const getAllAvailableTags = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(await getAllTags());
};

export const acceptVolunteerAdditionalData = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as IVolunteer;
    const defaultTagsId = req.body.defaultTagsId as string[];
    const addedTags = req.body.addedTags as string[];
    await containsIds(defaultTagsId);
    await connectTagsToVolunteer(data._id, defaultTagsId);
    await updateWithAdditionalData(data)
    await connectNewTagsToVolunteer(data._id, addedTags)

    res.status(200).json();
};