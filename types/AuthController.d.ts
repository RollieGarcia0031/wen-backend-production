import { Request, Response } from 'express';
import { refresh } from '../src/controller/AuthContoller';

export type login = (req: Request, res: Response) => void;

export type signup = (req: Request, res: Response) => void;

export type logout = (req: Request, res: Response) => void;

/**
 * It shall be called from the frontend whenever there's a 401 response
 * from the server in order to aid the persistence of logged-in user
 */
export type refresh = (req: Request, res: Response) => void;