import config from "./config";
import jwt from "jsonwebtoken";
import fs from "fs";
import bcrypt from "bcrypt";
import User from "./models/UserModel";
import * as path from "path";
import multer from "multer";

export const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    }, config.JWT_SECRET);
}

export const isAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        res.status(401).send({message: "Токен не підтримується"});
    } else {
        const token = bearerToken.slice(7, bearerToken.length);
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({message: "Некоректний токен"});
            } else {
                req.user = decoded;
                next();
            }
        });
    }
}
export const findUserSignIn = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error("Неправильна електрона пошта");
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Неправильний пароль")
    }
    return user;
}

export const savePhotoOnServer = (distanation, name) => {
    const multer = require('multer');
    const store = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, distanation);
        },
        filename(req, file, cb) {
            cb(null, name + path.extname(file.originalname));
        },
    });
    return multer({storage: store, limits: {fileSize: 4200000}, fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }}).single('file');
}

export const deletePhotoOnServer = (source) => {
    try {
        fs.unlinkSync(source)
    } catch(err) {
        console.error(err)
    }
}

const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extName){
        return cb(null, true);
    }else{
        cb('Помилка! Повині бути тількі фотографії!');
    }

}

export const getQuery = (query, fields = []) => {
    let queryReq = {};
    if (typeof query === "object"){
        let keysQuery = Object.keys(query);
        if(!keysQuery){
            return queryReq;
        }else{
            for(let i = 0; i < keysQuery.length; i++){
                if(keysQuery[i] === 'householdAppliances'){
                    queryReq[keysQuery[i]] = query[keysQuery[i]];
                }else if(keysQuery[i] === 'price'){
                    queryReq[keysQuery[i]] = {
                        $gte: query[keysQuery[i]].split(',')[0],
                        $lte: query[keysQuery[i]].split(',')[1]
                    }
                }
                else if(query[keysQuery[i]].split(',').length > 1){
                    queryReq[keysQuery[i]] = query[keysQuery[i]].split(',');
                }
                else if(keysQuery[i] === 'name' || keysQuery[i] === 'city' || keysQuery[i] === 'street' || keysQuery[i] === 'totalAction'){
                    queryReq[keysQuery[i]] = {
                        $regex: query[keysQuery[i]],
                        $options: 'i',
                    }
                }else{
                    if(query[keysQuery[i]] !== ''){
                        queryReq[keysQuery[i]] = query[keysQuery[i]];
                    }
                }
            }
        }
        return queryReq;
    }
}