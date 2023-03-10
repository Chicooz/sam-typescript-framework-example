#!/usr/bin/env node
const promptUtils = require("./util/prompt");
const userUtils = require("./util/user");
const passwordUtils = require("./util/password");

const insertUser = async () => {
    const environment = await promptUtils.promptEnvironment();
    
    const username = await promptUtils.promptUser("Please enter the username");

    var password = await promptUtils.promptUser("Please enter the password (leave blank to auto-generate):");

    if (!password) {
        console.log("Generating password...");
        password = passwordUtils.generatePassword();
        console.log(`Password: ${password}`);
    }
    try {
        const tableName = `Users-${environment}`;
        const userPutData = await userUtils.insertUser(
            username,
            password,
            tableName,
        );
        console.log("Success - user inserted", userPutData);
    } catch (err) {
        console.log("Error", err.stack);
    }
};

insertUser();
