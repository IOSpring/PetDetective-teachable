import SashiDoTeachableMachine from "@sashido/teachablemachine-node";

const beforeCrossValidationModel =
    "https://teachablemachine.withgoogle.com/models/VIbHHKJX_/";
const crossValidationBottom =
    "https://teachablemachine.withgoogle.com/models/YNWOxpJUf/";
const crossValidationMiddle =
    "https://teachablemachine.withgoogle.com/models/qnomp7CW7/";
const crossValidationTop =
    "https://teachablemachine.withgoogle.com/models/MG5p8QJN1/";

const breedModel = new SashiDoTeachableMachine({
    // modelUrl: "https://teachablemachine.withgoogle.com/models/VIbHHKJX_/",
    modelUrl: crossValidationBottom,
});
const colorModel = new SashiDoTeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/xpXeRQMqY/",
});

export const predictImageForBreedAndColor = async (req, res) => {
    if (req.files === null) return res.send("이미지를 업로드 해 주세요.");

    const f = await req.files.uploadFile;

    let breedPrediction = await breedModel.inference({
        data: f,
    });

    let colorPrediction = await colorModel.inference({
        data: f,
    });

    console.log("breed ", breedPrediction);

    let result = {
        breed: [],
        color: [],
    };

    for (let i = 0; i < 3; i++) {
        result.breed[i] = {
            prediction: breedPrediction[i].class,
            score: breedPrediction[i].score.toFixed(4),
        };
        result.color[i] = {
            prediction: colorPrediction[i].class,
            score: colorPrediction[i].score.toFixed(4),
        };
    }

    return res.send(result);
};
