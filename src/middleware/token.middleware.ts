import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

interface ValidationRequest extends Request {
    userData?: {
        id: string,
        username: string
    }
}

const checkTokenOrigin = (req: Request, res: Response, next: NextFunction) => {
    const ValidationReq = req as ValidationRequest;
    const { authorization } = ValidationReq.headers;

    if (!authorization) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: "Unathorized"
        })
    }

    const secretKey = process.env.JWT_SECRET!;

    try {
        const jwtVerify = jwt.verify(token, secretKey);

        if (typeof jwtVerify !== 'string') {
            ValidationReq.userData = jwtVerify as { id: string, username: string };

            if (jwtVerify && jwtVerify.origin !== "internal") {
                return res.status(403).json({
                    message: "Access Denied: External token"
                });
            }

            next();
        } else {
            return res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }
}
export default checkTokenOrigin;