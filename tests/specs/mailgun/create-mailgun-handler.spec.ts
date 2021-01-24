import { startMockgoose, resetMongoose } from "../../lib/mongoose";
//import { startSnsMock, resetSnsMock } from "../../lib/sns";
import { MailgunRestRequest } from "./mailgun-request";
import { CreateMailgunInputModel } from "../../../src/mailgun/models/mailgun-model";
import * as crypto from "crypto";
import { should } from "chai";
import * as awsMock from "aws-sdk-mock";
import * as awsSdk from "aws-sdk";
should();

const timestampValue = "1611488472";
const tokenValue = "8e9e853fc23f9ff3872481cf13afefa98523d87125f878e28b";

process.env.MAILGUN_SIGNING_KEY = "33333";
const signatureValue = crypto
  .createHmac("sha256", process.env.MAILGUN_SIGNING_KEY)
  .update(timestampValue.concat(tokenValue))
  .digest("hex");

const newMailgunResponse: CreateMailgunInputModel = new CreateMailgunInputModel(
  {
    signature: {
      timestamp: timestampValue,
      token: tokenValue,
      signature: signatureValue,
    },
    "event-data": {
      tags: ["my_tag_1", "my_tag_2"],
      timestamp: 1521472262.908181,
      storage: {
        url:
          "https://se.api.mailgun.net/v3/domains/sandbox978057ab2f724bb0961fb88767e99214.mailgun.org/messages/message_key",
        key: "message_key",
      },
      id: "1234",
    },
  }
);

let mailgunRestRequest: MailgunRestRequest;
describe("Log mailgun response", () => {
  before(async () => {
    mailgunRestRequest = new MailgunRestRequest();
    awsMock.setSDKInstance(awsSdk);
    awsMock.mock("SNS", "publish", "test-message");
    await startMockgoose();
  });

  afterEach(async () => {
    await resetMongoose();
    awsMock.restore();
  });

  it("should return 200 status after log mailgun response with right signature", async () => {
    let { response, body } = await mailgunRestRequest.callCreateAPI(
      newMailgunResponse
    );
    response.statusCode.should.be.equal(200);
    body.should.have.property("mailgun");
    const mailgun = body.mailgun;
    mailgun.should.have.property("id");
    mailgun.should.have.property("key");
  });

  it("should return 401 response status due to improper signature", async () => {
    let { response } = await mailgunRestRequest.callCreateAPI({
      signature: "improper",
    });
    response.statusCode.should.be.equal(401);
  });
});
