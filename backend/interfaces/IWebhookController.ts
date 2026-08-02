import { NextFunction, Request, Response } from "express";

export interface IWebhookController{
    handleRazorpayWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>

}