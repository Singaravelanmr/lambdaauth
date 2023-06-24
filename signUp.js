import * as bcrypt from "bcrypt";
import { dbUtility } from "./dbUtility.js";
import { v4 as uuidv4 } from "uuid";

export const signUp = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    console.log("came inside");
    console.log('reqBody',reqBody);

    const requestEmptyFlag = Object.keys(reqBody).length == 0 ? true : false;
    const user = !requestEmptyFlag && await dbUtility.getItem("users", { email: reqBody.email });

    console.log('user',user);
    let responseObj = {};

    if (requestEmptyFlag) {
      responseObj = {
        success: false,
        statusCode: 400,
        error: {
          message: "User details cant be empty",
        },
      };
      resolve(responseObj);
    } else if (user.Item) {
        console.log('came inside already regggg');
      responseObj = {
        success: false,
        statusCode: 400,
        error: {
          message:
            "Email is alreday registered, plesae use a different email for registration",
        },
      };
      resolve(responseObj);
    } else {
      // Hashing password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(reqBody.password, salt);
      const payload = {
        id: uuidv4(),
        userName: reqBody.userName,
        email: reqBody.email,
        password: hashPassword,
      };
      console.log('payload',payload);
      const result = await dbUtility.postItem("users", payload);
      console.log("dbResult", result);
      responseObj = {
        success: true,
        statusCode: 200,
        message: "User registered successfully",
      };
      resolve(responseObj);
    }
  });
};
