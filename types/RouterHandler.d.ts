import { Request, Response } from "express";

export type CustomRouterHandler = (req: Request, res: Response)=>void;