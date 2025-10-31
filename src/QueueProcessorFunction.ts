```typescript
import { SQSEvent } from 'aws-lambda';

export async function handler(event: SQSEvent): Promise<void> {
    console.log("Event received:", event);
    // Process each message
    for (const record of event.Records) {
        console.log("Processing record:", record);
        // Add your processing logic here
    }
}
```