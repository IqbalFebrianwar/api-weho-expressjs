import { Router } from "express";
import { accsessValidation } from "../auth/auth.controller";
import checkTokenOrigin from "../middleware/token.middleware";
import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.use(checkTokenOrigin);

router.get("/", accsessValidation, getUsers);
router.post("/", accsessValidation, createUser);
router.get("/:id", accsessValidation, getUserById);
router.patch("/:id", accsessValidation, updateUser);
router.delete("/:id", accsessValidation, deleteUser);

export default router;
