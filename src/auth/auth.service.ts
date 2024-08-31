import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bycrpt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();
const router = express.Router();

interface UserData {
    id: string;
    username: string;
}

interface ValidationRequest extends Request {
    headers: {
        authorization: string;
    }
    userData: {
        id: string;
        username: string;
    }
}
const accsessValidation = (req: Request, res: Response, next: NextFunction) => {
    const ValidationReq = req as ValidationRequest
    const { authorization } = ValidationReq.headers;

    if (!authorization) {
        return res.status(401).json({
            message: "Unathorized"
        })
    }

    const token = authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message: "Unathorized"
        })
    }
    const secretkey = process.env.JWT_SECRET!;

    try {
        const jwtVerify = jwt.verify(token, secretkey);

        if (typeof jwtVerify !== 'string') {
            ValidationReq.userData = jwtVerify as UserData
        }
    } catch (error) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    next()
}

router.use('/signin', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({
        where: {
            username: username
        }
    })

    if (!user || !user.password) {
        return res.status(404).json({ message: "Username atau password yang dimasukkan salah!" });
    }

    const isPasswordValid = await bycrpt.compare(password, user.password)

    if (isPasswordValid) {
        const payload = {
            id: user.id,
            username: user.username,
            password: user.password
        }

        const secretkey = process.env.JWT_SECRET!;
        const expireIn = 60 * 60 * 1;

        const token = jwt.sign(payload, secretkey, { expiresIn: expireIn })
        return res.json({
            data: {
                id: user.id,
                username: user.username
            },
            token: token
        })
    }
    else {
        return res.status(403).json({
            message: "Password yang dimasukkan salah!"
        })
    }
})
export default router;
export { accsessValidation }