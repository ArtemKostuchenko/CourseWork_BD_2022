import express from "express";
import {getQuery, isAuth} from "../utils";
import expressAsyncHandler from "express-async-handler";
import Category from "../models/CategoryModel";
import apartmentsRouter from "./apartmentsRouter";
import User from "../models/UserModel";
import userRouter from "./userRouter";

const categoryRouter = express.Router();

categoryRouter.get('/',  expressAsyncHandler(async (req, res) => {
    const searchKeyword  = getQuery(req.query)
    const categories = await Category.find({ ...searchKeyword});
    res.send(categories);
}));

categoryRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    if(req.user.isAdmin){
        const category = new Category({
            name: req.body.name
        })
        const createdCategory = await  category.save();
        if(!createdCategory){
            return res.status(401).send({message: "Помилка додавання категорії"})
        }else{
            res.send(createdCategory);
        }
    }else{
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));

categoryRouter.delete('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send({message: "Категорію не знайдено"});
        } else {
            category.remove();
            res.send({message: 'Категорію було видалено!'});
        }
    } else {
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));

export default categoryRouter;
