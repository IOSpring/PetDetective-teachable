import SashiDoTeachableMachine from "@sashido/teachablemachine-node";

const model = new SashiDoTeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/YNWOxpJUf/",
});

export const predictImage = async (req, res) => {
    if (req.files === null) return res.send("이미지를 업로드 해 주세요.");

    const f = await req.files.uploadFile;

    let predictions = await model.inference({
        data: f,
    });

    console.log(predictions);

    let predictionss = [];
    for (let i = 0; i < 3; i++) {
        predictionss[i] = {
            prediction: predictions[i].class,
            score: predictions[i].score.toFixed(4),
        };
    }

    return res.send(predictionss);
};
