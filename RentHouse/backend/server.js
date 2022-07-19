import express from 'express';
import cors from 'cors';
import data from  './data.js'
import userRouter from "./routers/userRouter";
import ConnectDB from "./db/ConnectionToMongoDB";
import bodyParser from 'body-parser';
import uploadRouter from "./routers/uploadRouter";
import leaseRouter from "./routers/leaseRouter";
import apartmentsRouter from "./routers/apartmentsRouter";
import categoryRouter from "./routers/categoryRouter";

const app = express();
ConnectDB();
app.use(bodyParser.json());
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/lease', leaseRouter)
app.use('/api/uploads', uploadRouter);
app.use('/api/apartments', apartmentsRouter);
app.use('/api/categories', categoryRouter);

const multer = require('multer');

const store = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './src/public/images');
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({storage: store}).single('file');

app.post("/profile", upload, (req, res, next) => {
    req.body.file
});

app.use((err, req, res, next) => {
    const status = err.name && err.name === 'ValidationError'? 400: 500;
    res.status(status).send({message: err.message});
})

app.listen(5000, () => {
    console.log("Server at http://localhost:5000");
});


