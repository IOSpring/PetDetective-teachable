import "regenerator-runtime";
import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import _ from "lodash";
import SashiDoTeachableMachine from "@sashido/teachablemachine-node";
import request from "request";
import url from "url";
import {predictImage} from "./service/imageService";
import {uploadFileInLocal} from "./service/fileService";

const app = express();
//
const port = process.env.PORT || 3000;

const model = new SashiDoTeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/i5_fILmWs/",
});

app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(express.static("uploads"));

app.get("/", (req, res, next) => {
    res.send("hello world!");
});

app.get("/test", async (req, res) => {
    const {url} = req.query;

    return model
        .classify({
            imageUrl: url,
        })
        .then((predictions) => {
            console.log(predictions);
            return res.json(predictions);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send("Something went wrong!");
        });
});

// IOS -> Express -> Spring -> IOS

app.post("/breed", predictImage);
app.get("/breed", (req, res, next) => {
    console.log(req.body);
    return res.json(JSON.stringify(req.body.predictions));
});

app.post("/upload", uploadFileInLocal);

app.listen(port, () => {
    console.log(`Hello world  http://localhost:${port}`);
});
