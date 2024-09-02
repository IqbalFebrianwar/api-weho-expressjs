import express from "express";
import userRoute from "./routers/user.router"
import authService from "./auth/auth.controller"

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Hello world!" });
});

app.use('/auth', authService)
app.use('/user', userRoute)

app.listen(PORT, ()=> {
    console.log(`server is running in PORT ${PORT}`)
})