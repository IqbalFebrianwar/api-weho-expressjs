import { Request, Response } from "express";
import prisma from "../models/user.model";
import { hashPassword } from "../utils/app";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany();
        if (!users) {
            return res.status(404).json({ message: "Data Not Found" });
        }
        return res.status(200).json({ message: "Users telah ditemukan", users });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        const user = await prisma.users.create({
            data: { username, password: hashedPassword },
        });

        if (!user) {
            return res.status(404).json({ message: "Data Not Found" });
        }

        return res.status(200).json({ message: "User telah ditambahkan", user });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await prisma.users.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "Data Not Found" });
        }

        return res.status(200).json({ message: "User telah ditemukan", user });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const userId = req.params.id;

    try {
        const existingUser = await prisma.users.findUnique({ where: { id: userId } });

        if (!existingUser) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const hashedPassword = password ? await hashPassword(password) : existingUser.password;

        await prisma.users.update({
            where: { id: userId },
            data: { username: username || existingUser.username, password: hashedPassword },
        });

        return res.status(200).json({ message: "Data User telah berhasil diubah" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const user = await prisma.users.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "Data Not Found" });
        }

        await prisma.users.delete({ where: { id: userId } });

        return res.status(200).json({ message: "User berhasil dihapus" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
