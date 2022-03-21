import SashiDoTeachableMachine from "@sashido/teachablemachine-node";
import url from "url";
import request from "request";
const model = new SashiDoTeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/ZbF8MC8-m/",
});

const LOCAL_ADDRESS = "localhost:3000";

export const predictImage = async (req, res) => {
    console.log(req.rawHeaders[7]);

    if (req.files === null) return res.send("이미지를 업로드 해 주세요.");

    const f = await req.files.uploadFile;

    let predictions = await model.inference({
        data: f,
    });

    let query = "";
    for (let i = 0; i < predictions.length; i++) {
        predictions[i] = {
            prediction: predictions[i].class,
            score: predictions[i].score.toFixed(4),
        };
        // query += `pre${i + 1}=${predictions[i].prediction}&score${i + 1}=${
        //     predictions[i].score
        // }`;
        query += `pre${i + 1}=prediction${[i]}&score${i + 1}=${
            predictions[i].score
        }`;
        if (i != predictions.length - 1) query += `&`;
    }
    query = query.replace(/(\s*)/g, "");
    console.log(predictions);

    const result = await request.post({
        uri:
            LOCAL_ADDRESS === "localhost:3000"
                ? "http://localhost:8080/teachable"
                : "https://iospring.herokuapp.com/teachable",
        body: {
            predictions: predictions,
        },
        json: true,
    });

    let newUrl;
    if (req.rawHeaders[7] === LOCAL_ADDRESS) {
        newUrl = url.parse(
            // `http://localhost:8080/teachable?pre1=${predictions[0].prediction}&score1=${predictions[0].score}&pre2=${predictions[1].prediction}&score2=${predictions[1].score}`
            `http://localhost:8080/teachable?${query}`
        );
    } else {
        newUrl = `https://iospring.herokuapp.com/teachable?pre1=${predictions[0].prediction}&score1=${predictions[0].score}&pre2=${predictions[1].prediction}&score2=${predictions[1].score}`;
    }

    // return res.redirect(url.format(newUrl));
    return res.send(predictions);
};
