import express from "express";
import { PrismaClient } from "@prisma/client";
import bycrpt from "bcryptjs"

const prisma = new PrismaClient();
const router = express.Router();

router.use('/signin', async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({
        where: {
            username: username
        }
    })

    if (!user) {
        return res.status(404).json({
            message: "Username yang dimasukkan salah!"
        })
    }

    if (!user.password) {
        return res.status(404).json({
            message: "Data Not Found"
        })
    }

    const isPasswordValid = await bycrpt.compare(password, user.password)

    if (isPasswordValid) {
        return res.json({
            data: {
                id: user.id,
                username: user.username,
                password: user.password
            }
        })
    }
    else {
        return res.status(403).json({
            message: "Password yang dimasukkan salah!"
        })
    }
})
export default router