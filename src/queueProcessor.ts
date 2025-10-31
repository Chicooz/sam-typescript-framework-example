export const handler = async (event) => {
  console.log('Processing event:', event);

  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    console.log('Message:', message);
    // Process the message as needed
  }

  return { statusCode: 200, body: 'Messages processed successfully' };
};