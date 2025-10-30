import { handler } from '../src/queueProcessor';

describe('Queue Processor', () => {
  it('should process messages correctly', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ key: 'value' }),
        },
      ],
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe("Messages processed successfully");
  });
});