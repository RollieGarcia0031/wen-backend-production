import { Request, Response, NextFunction } from "express"

export type middlewareHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => (void | Promise<void>);