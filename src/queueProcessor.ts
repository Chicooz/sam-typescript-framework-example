import { SQSHandler, SQSEvent } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        // Process the message here
        console.log('Processing message:', messageBody);
    }
};