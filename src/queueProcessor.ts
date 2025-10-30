export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    console.log("Processing message:", messageBody);

    // Add your processing logic here
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Processing complete" }),
  };
};