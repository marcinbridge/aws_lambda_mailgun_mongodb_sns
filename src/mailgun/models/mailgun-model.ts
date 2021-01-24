import { ApiModel } from "../../shared/models/api-model";

export class CreateMailgunInputModel extends ApiModel {
  signature: { timestamp: string; token: string; signature: string };
  "event-data": { id: string };
}

export class MailgunDataBase extends CreateMailgunInputModel {
  key: string;
}

export class MailgunDataModel extends MailgunDataBase {
  id?: string;
}

export class CreateMailgunOutputModel extends ApiModel {
  mailgun: MailgunDataModel;
}
