declare namespace Express {
    interface Request {
        wallet: string;
        signature: string;
        type: string;
        message: string;
    }
}