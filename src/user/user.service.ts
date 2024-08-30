import express from "express";
import { PrismaClient } from "@prisma/client";
import bycrpt, { genSalt } from "bcryptjs"

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const user = await prisma.users.findMany()

        if(!user){
            return res.status(404).json({
                message: "Data Not Found"
            })
        }
        
        return res.status(200).json({
            message: "Users telah ditemukan",
            user: user
        })

    } catch (error) {
        return res.status(500).json({ error: "Error Internal Server!"})
    }
})

router.post('/', async (req, res) => {
    const newData = req.body;
    
    try {
        const hashPass = await bycrpt.hash(newData.password, 10);
        const user = await prisma.users.create({
            data: {
                username: newData.username,
                password: hashPass,
            },
        });

        if(!user.username || !user.password){
            return res.status(404).json({
                message: "Data Not Found"
            })
        }

        return res.status(200).json({
            message: "User telah ditambahkan",
            user: user,
        });
    } catch (error) {
        return res.status(500).json({ error: "Error Internal Server!!" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const data = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });

        if (!data) {
            return res.status(404).json({
                error: "Data Not Found",
            });
        }

        return res.status(200).json({
            message: "User telah ditemukan",
            user: data,
        });
    } catch (error) {
        console.error("Error:", error); // Log error jika terjadi
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});


router.patch('/:id', async (req, res) => {
    const changeData = req.body;
    const dataId = req.params.id;

    try {
        const data = await prisma.users.update({
            where :{
                id: dataId
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
        return res.status(500).json({ error: "Error Internal Server"})
    }
})

router.delete('/:id', async(req, res) => {
    const userId = req.params.id;

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return res.status(404).json({
                error: "Data Not Found",
            });
        }

        const data = await prisma.users.delete({
            where:{
                id: userId,
            }
        })

        return res.status(200).json({
            message: "User berhasil untuk dihapus"
        })

    } catch (error) {
        return res.status(500).json({ error : "Error Internal Server"})
    }
})


export default router;