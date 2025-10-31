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
                    body: 'Hello, world!',
                    attributes: {},
                    messageAttributes: {},
                    md5OfBody: 'xyz',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:MyQueue',
                    awsRegion: 'us-east-1'
                }
            ]
        };

        const consoleSpy = jest.spyOn(console, 'log');
        await handler(mockEvent);
        expect(consoleSpy).toHaveBeenCalledWith('Processing message 1: Hello, world!');
    });
});
```