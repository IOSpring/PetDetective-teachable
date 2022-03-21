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
//teachablemachine-node
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
app.post("/color", async (req, res) => {
    console.log(req.rawHeaders[7]);
    const isLocal = req.rawHeaders[7] == "localhost:3000";
    if (isLocal) {
        console.log("hi");
    }
    // 파일 저장
    const f = req.files.uploadFile;
    // 면접
    // 갈등 사항
    //
    const fileUrl = `http://localhost:3000/${f.name}`;

    let predictions = await model.classify({
        imageUrl: fileUrl,
    });

    for (let i = 0; i < predictions.length; i++) {
        predictions[i] = {
            prediction: predictions[i].class,
            score: predictions[i].score,
        };
    }

    const newUrl = url.parse(
        `http://localhost:8080/teachable?pre1=${predictions[0].prediction}&score1=${predictions[0].score}&pre2=${predictions[1].prediction}&score2=${predictions[1].score}`
    );

    return res.redirect(url.format(newUrl));
});

app.post("/breed", predictImage);

// 사진 업로드
app.post("/upload", async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "파일 업로드 실패",
            });
        } else {
            let f = req.files.uploadFile;
            console.log(f.name);
            f.mv("./uploads/" + f.name);
            res.send({
                status: true,
                message: "파일이 업로드 되었습니다.",
                data: {
                    name: f.name,
                    minetype: f.minetype,
                    size: f.size,
                },
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Hello world  http://localhost:${port}`);
});
