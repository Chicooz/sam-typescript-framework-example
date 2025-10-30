import { handler } from '../src/queueProcessor';

describe('Queue Processor Function', () => {
  it('should process messages from the queue', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ key: 'value' }),
        },
      ],
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe("Processing complete");
  });
});