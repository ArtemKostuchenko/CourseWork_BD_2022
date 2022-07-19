import express from "express";
import { isAuth, savePhotoOnServer} from "../utils";
import Apartment from "../models/AppartmentModel";

const uploadRouter = express.Router();

uploadRouter.post("/profile/:id", isAuth, (req, res) => {
   const upload = savePhotoOnServer('./frontend/files/profile/images', req.params.id + '_profile');
   upload(req, res, (err) => {
      if(err){
          res.send({error: "Не вдалося зберігти фото на профіль"});
      }else{
         res.send({photo: req.params.id + '_profile'});
      }
   });
});

uploadRouter.post("/apartments/:id", isAuth,  (req, res) => {
   const upload = savePhotoOnServer('./frontend/files/apartments/images', req.params.id + '_apartment');
   upload(req, res, async (err) => {
      if(err){
         res.send({error: "Не вдалося зберігти фото на квартиру / будинок"});
      }else{
         const apartment = await Apartment.findById(req.params.id);
         if(apartment){
            apartment.image = req.params.id + '_apartment.jpg';
            await apartment.save();
         }
         res.send({photo: req.params.id + '_apartment'});
      }
   });
});

export default uploadRouter;