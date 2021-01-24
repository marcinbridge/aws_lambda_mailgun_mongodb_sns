import { CreateMailgunCommandHandler } from "./services/create-mailgun-command-handler";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import * as crypto from "crypto";
import {
  CreateMailgunOutputModel,
  CreateMailgunInputModel,
} from "./models/mailgun-model";
import { startMongoose } from "../shared/mongoose/mongoose";
import { sendToSNS } from "../shared/sns/sns";
import { ResponseBuilder } from "../shared/response-builder";

export default class MailgunController {
  private createMailgunHandler: CreateMailgunCommandHandler;

  /**
   * @memberof MailgunController
   */
  constructor() {
    this.createMailgunHandler = new CreateMailgunCommandHandler();
  }

  /**
   * Push request entry point
   *
   * @returns {RegisterOutputModel}
   * @memberof MailgunController
   */
  public create: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const body = String(event.body);
    const mailgunData: CreateMailgunInputModel = JSON.parse(body);
    let mailgunOutput: CreateMailgunOutputModel;
    const signature = mailgunData?.signature;
    if (
      signature &&
      !this.checkSignature(
        String(process.env.MAILGUN_SIGNING_KEY),
        signature.timestamp,
        signature.token,
        signature.signature
      )
    ) {
      return ResponseBuilder.unauthorized("Invalid signature");
    }

    await startMongoose();
    try {
      mailgunOutput = await this.createMailgunHandler.handle(
        event.requestContext,
        mailgunData
      );
      await sendToSNS(JSON.stringify(mailgunData));

      return ResponseBuilder.ok({
        ...mailgunOutput,
      });
    } catch (error) {
      return ResponseBuilder.unprocessableEntity(error.message);
    }
  };

  private checkSignature(
    signingKey: string,
    timestamp: string,
    token: string,
    signature: string
  ): boolean {
    if (signingKey && timestamp && signature) {
      return (
        crypto
          .createHmac("sha256", signingKey)
          .update(timestamp.concat(token))
          .digest("hex") === signature
      );
    }
    return false;
  }
}
