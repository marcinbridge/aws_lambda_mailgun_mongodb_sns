import MailgunModel from "../models/mailgun-mongo-model";
import { CqrsServiceBase } from "../../shared/services/ioc-services";
import {
  CreateMailgunInputModel,
  CreateMailgunOutputModel,
} from "../models/mailgun-model";
import { APIGatewayEventRequestContext } from "aws-lambda";

export class CreateMailgunCommandHandler implements CqrsServiceBase {
  async handle(
    context: APIGatewayEventRequestContext,
    input: CreateMailgunInputModel
  ): Promise<CreateMailgunOutputModel> {
    try {
      let mailgun = new MailgunModel(input);
      let newMailgun = await mailgun.save();

      let returnValue: CreateMailgunOutputModel = {
        mailgun: newMailgun.toJSON(),
      };
      return returnValue;
    } catch (error) {
      throw error;
    }
  }
}
