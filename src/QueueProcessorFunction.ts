```typescript
import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
    try {
        for (const record of event.Records) {
            console.log(`Processing message ${record.messageId}: ${record.body}`);
            // Process message logic here
        }
    } catch (error) {
        console.error(`Error processing messages: ${error}`);
        throw error;
    }
};
```