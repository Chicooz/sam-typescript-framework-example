import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        console.log('Processing record:', record);
        // Add your message processing logic here
    }
};