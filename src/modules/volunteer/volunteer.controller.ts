import {NextFunction, Request, Response} from "express";
import {getVolunteers} from "./volunteer.service";
import {getTagsForVolunteer} from "./tags/tags.service";

export const getVolunteerList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await getVolunteers(req.body.volunteerId, parseInt(req.body.limit, 10)).then(volunteers => res.status(200).json({
        data: volunteers
    }));
}