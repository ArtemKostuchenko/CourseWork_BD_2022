import express from "express";
import User from "../models/UserModel";
import expressAsyncHandler from "express-async-handler";
import {deletePhotoOnServer, findUserSignIn, generateToken, getQuery, isAuth, savePhotoOnServer} from "../utils";

const userRouter = express.Router();

userRouter.get("/", isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        const searchKeyword = getQuery(req.query);
        const users = await User.find({...searchKeyword});
        res.send(users)
    } else {
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));

userRouter.get("/createadmin", expressAsyncHandler(async (req, res) => {
    try {
        const user = new User({
            name: 'admin',
            email: "admin@example.com",
            password: '12345',
            isAdmin: true,
            photo: 'profile_default.png'
        });
        const createdUser = await user.save();
        res.send(createdUser);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}));

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const signInUser = await findUserSignIn(req.body.email, req.body.password);
    if (signInUser) {
        res.send({
            _id: signInUser._id,
            name: signInUser.name,
            email: signInUser.email,
            photo: signInUser.photo,
            isManager: signInUser.isManager,
            isAdmin: signInUser.isAdmin,
            token: generateToken(signInUser)
        })
    }
}));

userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const existUser = await User.findOne({
        email: req.body.email
    });
    if (existUser) {
        return res.status(401).send({message: "Такий користувач з елек. поштою вже існує"});
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        photo: "profile_default.png"
    });
    const createdUser = await user.save();
    if (!createdUser) {
        return res.status(401).send({message: "Помилка додавання користувача"});
    } else {
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            photo: createdUser.photo,
            isManager: createdUser.isManager,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser)
        })
    }
}));

userRouter.delete('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({message: "Користувача не знайдено"});
        } else {
            deletePhotoOnServer(`./frontend/files/profile/images/${req.params.id}_profile.jpg`);
            user.remove();
            res.send({message: 'Користувача було видалено!'});
        }
    } else {
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));

userRouter.put('/role/:id', isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({message: "Користувача не знайдено"});
        } else {
            user.isAdmin = req.body.isAdmin;
            user.isManager = req.body.isManager;
            const updateUser = await user.save();
            res.send(updateUser);
        }
    } else {
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));

userRouter.put('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).send({message: "Користувача не знайдено"});
    } else {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        if (req.body.photo !== "") {
            user.photo = req.params.id + '_profile.jpg';
        }
        const updateUser = await user.save()
        res.send({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            photo: updateUser.photo,
            isManager: updateUser.isManager,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser),
            testPhoto: req.body.photo
        })
    }
}));


export default userRouter;