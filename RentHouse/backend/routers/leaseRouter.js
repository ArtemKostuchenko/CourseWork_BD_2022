import express from "express";
import {getQuery, isAuth} from "../utils";
import expressAsyncHandler from "express-async-handler";
import Lease from "../models/LeaseModel";
import User from "../models/UserModel";
import Apartment from "../models/AppartmentModel";

const leaseRouter = express.Router();

leaseRouter.get('/summary', isAuth, expressAsyncHandler(async (req, res) => {
    if(req.user.isAdmin){
        const lease = await Lease.aggregate([
            {
                $group: {
                    _id: null,
                    numLease: {$sum: 1},
                    totalSales: {$sum: '$itemsPrice'}
                }
            }
        ]);
        const users = await User.aggregate([
            {
                $group: {
                    _id: null,
                    numUsers: {$sum: 1}
                }
            }
        ]);
        const dailyRent = await Lease.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt'}},
                    lease: {$sum: 1},
                    sales: {$sum: "$itemsPrice"}
                }
            }
        ]);
        const apartmentCategories = await Apartment.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: {$sum: 1}
                }
            }
        ]);
        res.send({users, lease, dailyRent, apartmentCategories})
    }
}));

leaseRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
    const leaseAll = await Lease.find({user: req.user._id});
    res.send(leaseAll);
}));

leaseRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    const lease = new Lease({
        rentItems: req.body.rentItems,
        user: req.user._id,
        registLease: req.body.lease,
        payment: req.body.payment,
        itemsPrice: req.body.itemsPrice,
    });
    const createdLease = await lease.save();
    res.status(201).send({message: "Оренда пройшла успішно\n", lease: {createdLease}})
}));

leaseRouter.get('/', isAuth, expressAsyncHandler(async (req, res) => {
   if(req.user.isAdmin || req.user.isManager){
       const searchKeyword = getQuery(req.query);
       const leaseAll = await Lease.find({...searchKeyword}).populate('user');
       res.send(leaseAll);
   }else{
       res.status(401).send({message: "Ви не є адміністратором чи менеджером сайту!!!"});
   }
}));

leaseRouter.delete('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    if(req.user.isAdmin || req.user.isManager){
        const lease = await Lease.findById(req.params.id);
        if(lease){
            const deleteLease = await lease.remove();
            res.send({message: "Орендування видалене", rent: deleteLease});
        }else{
            res.status(404).send({message: "Орендування не знайдено"});
        }
    }else{
        res.status(401).send({message: "Ви не є адміністратором чи менеджером сайту!!!"});
    }
}));



leaseRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const lease = await Lease.findById(req.params.id);
    if(lease){
        res.send(lease);
    }else{
        res.status(404).send({message: "Орендування не знайдено"});
    }
}));

leaseRouter.post('/pay/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const lease = await Lease.findById(req.params.id);
    if(lease){
        if(req.body.status === true){
            lease.paidAt = Date.now();
            lease.isPaid = true;
        }else{
            lease.isPaid = false;
        }
        const updateLease = await lease.save();
        res.send(updateLease);
    }else{
        res.status(404).send({message: "Орендування не знайдено"});
    }
}));

leaseRouter.post('/confirm/:id', isAuth, expressAsyncHandler(async (req, res) => {
    if(req.user.isAdmin || req.user.isManager){
        const lease = await Lease.findById(req.params.id);
        if(lease){
            lease.isConfirm = req.body.isConfirm;
            lease.confirmAt = Date.now();
            for(let i = 0; i < lease.rentItems.length; i++){
                const apartment = await Apartment.findById(lease.rentItems[i].apartment);
                if(apartment){
                    apartment.StockIn = true;
                    const up = await apartment.save();
                }
            }
            const updateLease = await lease.save();
            res.send(updateLease);
        }else{
            res.status(404).send({message: "Орендування не знайдено"});
        }
    }else{
        res.status(401).send({message: "Ви не є адміністратором чи менеджером сайту!!!"});
    }
}));




export default leaseRouter;