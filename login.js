import * as bcrypt from "bcrypt";
import jsonwebtoken  from 'jsonwebtoken';
import { dbUtility } from "./dbUtility.js";

export const login = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    console.log("reqBody is coming.....", reqBody);

    const requestEmptyFlag = Object.keys(reqBody).length == 0 ? true : false;
    const user = !requestEmptyFlag && (await dbUtility.getItem("users", { email: reqBody.email }));
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    let responseObj = {};

    console.log("user found", user);

    if (requestEmptyFlag) {
      responseObj = {
        success: false,
        statusCode: 400,
        error: {
          message: "User details cant be empty",
        },
      };
      resolve(responseObj);
    } else if (!user.Item) {
      responseObj = {
        success: false,
        statusCode: 400,
        error: {
          message: "User not found, either email or password is wrong",
        },
      };
      resolve(responseObj);
    } else {
      const passwordCheck = bcrypt.compareSync(reqBody.password,user.Item.password);
      if (passwordCheck) {
        const token = jsonwebtoken.sign({ userName: reqBody.userName, password: user.Item.password }, jwtSecretKey);
        responseObj = {
          success: true,
          statusCode: 200,
          message: "User login success",
          authToken: token
        };
        resolve(responseObj);
      } else {
        responseObj = {
          success: false,
          statusCode: 400,
          error: {
            message: "Password is wrong",
          },
        };
        resolve(responseObj);
      }
    }
  });
};
