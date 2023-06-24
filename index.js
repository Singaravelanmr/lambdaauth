import { signUp } from "./signUp.js";
import { login } from "./login.js";

export const handler = async (event, context) => {
  console.log("event", event);

  let body = {};
  let statusCode = 200;
  let response = {};
  const headers = { "Content-Type": "application/json" };

  const customKey = event.httpMethod + " " + event.resource;
  const reqBody = Object.keys(event).length > 0 ? JSON.parse(event.body) : event;
  //   const pathParameter = event?.pathParameters?.id;

  try {
    switch (customKey) {
      case "POST /signup":
        response = await signUp(reqBody);
        console.log("response", response);
        statusCode = response.statusCode;
        body = response;
        break;
      case "POST /login":
        response = await login(reqBody);
        console.log("response", response);
        statusCode = response.statusCode;
        body = response;
        break;
      default:
        throw new Error(`Unsupported route: "${customKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
