const prompt = require("prompt");

exports.promptUser = message => {
    prompt.start();
    console.log(message);
    return new Promise((resolve, reject) => {
        prompt.get(["input"], function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res.input);
            }
        });
    });
};

exports.promptEnvironment = async () => {
    const environment = await this.promptUser("Please specify the environment (e.g. 'Dev' or 'Prod', Default 'Dev')");
    return environment == "Prod" ? "Prod" : "Dev";
};

exports.promptProduct = async () => {
    const product = await this.promptUser("Please specify the product (e.g. '' or 'WeCare', Default '')");
    return product == "WeCare" ? product : "";
};
