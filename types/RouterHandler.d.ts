import { Request, Response } from "express";

export type CustomRouterHandler= (res: Request, res: Response) => (void | Promise)