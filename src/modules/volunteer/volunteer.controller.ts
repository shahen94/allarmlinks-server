import {NextFunction, Request, Response} from "express";
import {getVolunteers} from "./volunteer.service";
import {getTagsForVolunteer} from "./tags/tags.service";
import {IFilterQuery} from "./volunteer.model";

export const getVolunteerList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(req.query);

    // @ts-ignore
    await getVolunteers(req.query.volunteerId, parseInt(req?.query?.limit as string, 10), req?.query?.filter).then(volunteers => res.status(200).json({
        data: volunteers
    }));
}