import { CustomeError } from "@utils"
import { NextFunction, Request, Response } from "express"
import { ObjectSchema } from "yup"

export const yupvalidation = (validator: ObjectSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            validator.validateSync(req.body, { abortEarly: false })
            next()
        } catch (err) {
            next(new CustomeError(err.errors.join(', ')))
        }
    }
}