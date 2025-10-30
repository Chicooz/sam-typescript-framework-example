export const handler = async (event) => {
  console.log("Received SQS event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const messageBody = record.body;
    console.log("Processing message:", messageBody);

    // Add your message processing logic here

    // Optionally delete the message after processing
    // await deleteMessageFromQueue(record.receiptHandle);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Messages processed successfully" }),
  };
};