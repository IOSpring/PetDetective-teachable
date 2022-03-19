export const predictImage = async (req, res) => {
    const f = req.files.uploadFile;

    const fileUrl = `http://localhost:3000/${f.name}`;

    let predictions = await model.classify({
        imageUrl: fileUrl,
    });

    for (let i = 0; i < predictions.length; i++) {
        predictions[i] = {
            prediction: predictions[i].class,
            score: predictions[i].class,
        };
    }

    console.log(predictions);
    const result = await request.post({
        headers: {"content-type": "application/json"},
        uri: "http://localhost:8080/teachable",
        body: predictions,
        json: true,
    });
    if (result.error) {
        res.status(500).send("Something went wrong!");
    }

    return res.send(predictions);
};
