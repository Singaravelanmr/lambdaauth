import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
let command;

export const dbUtility = {
    getAllItems: async function (tableName) {
        command = new ScanCommand({ TableName: tableName });
        return await dynamo.send(command);
    },
    getItem: async function (tableName, keyObject) {
        console.log('keyObject',keyObject);
        command = new GetCommand({ TableName: tableName, Key: keyObject });
        return await dynamo.send(command);
    },
    postItem: async function (tableName, itemObject) {
        console.log('tableName', tableName);
        console.log('itemObject',itemObject);
        command = new PutCommand({ TableName: tableName, Item: itemObject });
        return dynamo.send(command);
    },
    updateItem: async function (tableName, keyObject, updateItemName, updateItemValue) {
        command = new UpdateCommand({
            TableName: tableName,
            Key: keyObject,
            UpdateExpression: `set ${updateItemName} = :n`,
            ExpressionAttributeValues: { ":n": updateItemValue },
            ReturnValues: "UPDATED_NEW",
        });
        return await dynamo.send(command);
    },
    deleteItem: async function (tableName, keyObject) {
        command = new DeleteCommand({ TableName: tableName, Key: keyObject });
        return await dynamo.send(command);
    },
};