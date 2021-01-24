import MailgunController from "./mailgun-controller";
import { APIGatewayProxyHandler } from "aws-lambda";

const mailgunController: MailgunController = new MailgunController();
export const create: APIGatewayProxyHandler = mailgunController.create;
