export const uploadFileInLocal = async (req, res) => {
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
};
