import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const user = await prisma.users.findMany()
        
        return res.status(200).json({
            message: "Users telah ditemukan",
            user: user
        })

    } catch (error) {
        return res.status(500).json({ error: "Users tidak dapat ditemukan!"})
    }
})

router.post('/', async (req, res) => {
    const newData = req.body;

    try {
        const user = await prisma.users.create({
            data: {
                username: newData.username,
                password: newData.password,
            },
        });

        return res.status(200).json({
            message: "User telah ditambahkan",
            user: user,
        });
    } catch (error) {
        return res.status(500).json({ error: "Data user sudah tersedia!!" });
    }
});

router.get('/:id', async (req, res) =>{

    try {
        const data = prisma.users.findUnique({
            where:{
                id : req.params.id
            }
        })

        if (!data) {
            return res.status(404).json({
                error: "Data user id tidak tersedia.",
            });
        }

        return res.status(200).json({
            message : "User telah ditemukan",
            user : data,
        });
    } catch (error) {
        return res.status(500).json({ error: "User tidak ditemukan!"})
    }
})

router.patch('/:id', async (req, res) => {
    const changeData = req.body;

    try {
        const data = await prisma.users.update({
            where :{
                id: req.params.id
            },
            data:{
                username: changeData.username,
                password: changeData.password
            }
        })

        return res.status(200).json({
            message : "Data User telah berhasil diubah",
        })
    } catch (error) {
        return res.status(500).json({ error: "User tidak bisa diubah!"})
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!user) {
            return res.status(404).json({
                error: "Data user id tidak tersedia.",
            });
        }

        const data = await prisma.users.delete({
            where:{
                id: req.params.id
            }
        })

        return res.status(200).json({
            message: "User berhasil untuk dihapus"
        })

    } catch (error) {
        return res.status(500).json({ error : "User gagal untuk dihapus!"})
    }
})


export default router;