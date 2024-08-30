import express from "express";
import userController from "./user/user.service"

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({massage : "Selamat datang di API!"})
})

app.post('/', (req, res) => {
    res.json({ message: "Hello world!" });
});

app.use('/user', userController)

app.listen(PORT, ()=> {
    console.log(`server is running in PORT ${PORT}`)
})