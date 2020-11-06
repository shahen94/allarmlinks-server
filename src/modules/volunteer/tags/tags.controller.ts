import {NextFunction, Request, Response} from "express";
import {getTagsForVolunteer} from "./tags.service";

export const getAllAvailableTagsForVolunteer = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(await getTagsForVolunteer(req.body.volunteerId));
};