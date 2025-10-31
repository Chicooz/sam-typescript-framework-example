// Existing content preserved

// New test code added below

import { handler as queueProcessorHandler } from './queueProcessor';

// Example test for the queue processor
describe('Queue Processor Tests', () => {
  it('should process SQS event correctly', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ message: 'Test message' }),
        },
      ],
    };

    const result = await queueProcessorHandler(event);

    expect(result).toBeDefined();
    // Add more assertions as needed
  });
});