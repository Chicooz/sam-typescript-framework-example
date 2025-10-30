export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    
    // Process each record in the event
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        console.log("Processing message:", messageBody);
        
        try {
            // Add your message processing logic here
            // For example, re-invoke the original Lambda function or handle the message accordingly
            
            console.log("Message processed successfully:", messageBody);
        } catch (error) {
            console.error("Error processing message:", error);
            // Handle the error (e.g., send to another DLQ, log, etc.)
        }
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Processing complete" }),
    };
};