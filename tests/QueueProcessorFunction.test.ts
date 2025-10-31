```typescript
import { handler } from '../src/QueueProcessorFunction';
import { SQSEvent } from 'aws-lambda';

describe('QueueProcessorFunction', () => {
    it('should process messages correctly', async () => {
        const mockEvent: SQSEvent = {
            Records: [
                {
                    messageId: '1',
                    receiptHandle: 'abc',
                    body: 'Test message',
                    attributes: {},
                    messageAttributes: {},
                    md5OfBody: 'def',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:MyQueue',
                    awsRegion: 'us-east-1'
                }
            ]
        };

        const consoleSpy = jest.spyOn(console, 'log');
        await handler(mockEvent);
        expect(consoleSpy).toHaveBeenCalledWith('Event received:', mockEvent);
        expect(consoleSpy).toHaveBeenCalledWith('Processing record:', mockEvent.Records[0]);
    });
});
```