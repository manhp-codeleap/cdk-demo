import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocument, ScanCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({}); // default client (reuse connection)
const documentClient = DynamoDBDocument.from(client, {
  marshallOptions: { removeUndefinedValues: true },
  unmarshallOptions: { wrapNumbers: false },
});

// this function will scan the db and get all the result into the client
export const handler = async (): Promise<APIGatewayProxyResult> => {
  if (process.env.TABLE_NAME == null)
    throw new Error('Invalid setting, missing table_name');
  const result = await documentClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  // return the result to client
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items ?? []),
  };
};
