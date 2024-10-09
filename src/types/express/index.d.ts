// src/types/express/index.d.ts
import express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                uuid: string;
            };
        }
    }
}
