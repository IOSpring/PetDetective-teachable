import "regenerator-runtime";
import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import _ from "lodash";
import SashiDoTeachableMachine from "@sashido/teachablemachine-node";
import {predictImage} from "./service/breedPredict";
import {predictColor} from "./service/colorPredict";
const app = express();

const PORT = process.env.PORT || 3200;

app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));

app.post("/breed", predictImage);
app.post("/color", predictColor);

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

app.listen(PORT, handleListen);
