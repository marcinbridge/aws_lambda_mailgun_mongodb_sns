import { RestRequest, ActionRequestOutput } from "../RestRequest";
import { CreateMailgunOutputModel } from "../../../src/mailgun/models/mailgun-model";
import { create } from "../../../src/mailgun/mailgun";

export class MailgunRestRequest extends RestRequest {
  async callCreateAPI(
    body: any
  ): Promise<ActionRequestOutput<CreateMailgunOutputModel>> {
    return await this.CallRestAPI<CreateMailgunOutputModel>(create, {
      body,
    });
  }
}
