const commands = require("@aws-sdk/lib-dynamodb");
const passwordUtils = require("./password");
const crypto = require("crypto");
const docClient = require("./dynamo-document-client");

const insertUser = async (
    username,
    password,
    usersTableName = null,
) => {
    const generatedSalt = passwordUtils.generateSalt();
    const hashedPassword = passwordUtils.encryptPassword(generatedSalt, password);


    const tableName = usersTableName ?? 'Users-Dev';
    const params = {
        TableName: tableName,
        Item: {
            username: username,
            password: hashedPassword,
            authToken: generatedSalt,
            userId: crypto.randomUUID(),
            
        },
    };
    return await docClient.ddbDocClient.send(new commands.PutCommand(params));
};

module.exports ={
    insertUser
}