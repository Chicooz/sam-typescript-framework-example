exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            user: event?.requestContext?.authorizer?.principalId,
        }),
    };
};
