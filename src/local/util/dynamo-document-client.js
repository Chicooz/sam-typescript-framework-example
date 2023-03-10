// Create a service client module using ES6 syntax.
const dynamobDbClient = require("@aws-sdk/lib-dynamodb");
const ddbClient = require("./dynamo-client");

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB document client.
const ddbDocClient = dynamobDbClient.DynamoDBDocumentClient.from(ddbClient.ddbClient, translateConfig);

module.exports = { ddbDocClient };
