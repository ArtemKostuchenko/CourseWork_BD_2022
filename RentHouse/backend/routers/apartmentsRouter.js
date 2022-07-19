import express from "express";
import {deletePhotoOnServer, getQuery, isAuth} from "../utils";
import expressAsyncHandler from "express-async-handler";
import Apartment from "../models/AppartmentModel";

const apartmentsRouter = express.Router();

apartmentsRouter.get("/", expressAsyncHandler(async (req, res) => {
    const searchKeyword = getQuery(req.query)
    const apartments = await Apartment.find({...searchKeyword});
    res.send(apartments);
}));

apartmentsRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        let image = "apartment_2.jpg"
        const apartment = new Apartment({
            name: req.body.name,
            category: req.body.category,
            countRooms: req.body.countRooms,
            totalArea: req.body.totalArea,
            city: req.body.city,
            street: req.body.street,
            totalAction: req.body.totalAction,
            numberApartment: req.body.numberApartment,
            furnitureAvailability: req.body.furnitureAvailability,
            floor: req.body["floor"],
            multimedia: req.body.multimedia,
            householdAppliances: req.body.householdAppliances,
            image: image,
            price: req.body.price,
            Characteristics: req.body.Characteristics,
        });
        const createdApartment = await apartment.save();
        if (!createdApartment) {
            return res.status(401).send({message: "Помилка додавання квартири / будинку"})
        } else {
            res.send(createdApartment);
        }
    } else {
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));


apartmentsRouter.put('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        const apartment = await Apartment.findById(req.params.id)
        if (!apartment) {
            return res.status(404).send({message: "Квартира / будинок не знайдено"});
        } else {
            apartment.name = req.body.name || apartment.name;
            apartment.category = req.body.category || apartment.category;
            apartment.countRooms = req.body.countRooms || apartment.countRooms;
            apartment.totalArea = req.body.totalArea || apartment.totalArea;
            apartment.city = req.body.city || apartment.city;
            apartment.street = req.body.street || apartment.street;
            apartment.totalAction = req.body.totalAction || apartment.totalAction;
            apartment.numberApartment = req.body.numberApartment || apartment.numberApartment;
            apartment.furnitureAvailability = req.body.furnitureAvailability || apartment.furnitureAvailability;
            apartment.floor = req.body["floor"] || apartment.floor;
            apartment.multimedia = req.body.multimedia || apartment.multimedia;
            apartment.householdAppliances = req.body.householdAppliances || apartment.householdAppliances;
            apartment.price = req.body.price || apartment.price;
            apartment.Characteristics = req.body.Characteristics || apartment.Characteristics;
            const updateApartment = await apartment.save();
            res.send(updateApartment);
        }
    } else {
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));

apartmentsRouter.post('/:id/reviews', isAuth, expressAsyncHandler(async (req, res) => {
    const apartment = await Apartment.findById(req.params.id)
    if (!apartment) {
        return res.status(404).send({message: "Квартира / будинок не знайдено"});
    } else {
      const review = {
          rating: req.body.rating,
          comment: req.body.comment,
          user: req.user._id,
          name: req.user.name,
      }
      apartment.reviews.push(review);
      apartment.rating = apartment.reviews.reduce((a, c) => c.rating + a, 0) / apartment.reviews.length;
      apartment.numReviews = apartment.reviews.length;
      const updatedApartment = await apartment.save();
      res.status(201).send({
          data: updatedApartment.reviews[updatedApartment.reviews.length -1]
      })
    }
}));

apartmentsRouter.delete('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    if (req.user.isAdmin) {
        const apartment = await Apartment.findById(req.params.id)
        if (!apartment) {
            return res.status(404).send({message: "Квартира / будинок не знайдено"});
        } else {
            try {
                deletePhotoOnServer(`./frontend/files/apartments/images/${req.params.id}_apartment.jpg`)
                await Apartment.deleteOne({_id: req.params.id});
                res.send({message: "Видалено"})
            } catch (e) {
                return res.status(401).send({message: e});
            }
        }
    } else {
        return res.status(401).send({message: "Ви не адміністратор чи менеджер сайту"})
    }
}));

apartmentsRouter.get("/:id", async (req, res) => {
    const apartment = await Apartment.findById(req.params.id)
    if (apartment) {
        res.send(apartment);
    } else {
        res.status(404).send({message: "Apartment Not Found"});
    }
});

export default apartmentsRouter;