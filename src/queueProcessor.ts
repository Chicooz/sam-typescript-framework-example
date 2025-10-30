import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
    for (const record of event.Records) {
        try {
            // Process the message
            console.log(`Processing message: ${record.body}`);
            // Add your message processing logic here

        } catch (error) {
            console.error(`Error processing message: ${record.body}`, error);
            // Handle the error (e.g., log it, send to another DLQ, etc.)
        }
    }
};