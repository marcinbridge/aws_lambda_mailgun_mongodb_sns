import * as awsMock from "aws-sdk-mock";
import * as awsSdk from "aws-sdk";

export async function startSnsMock() {
  awsMock.setSDKInstance(awsSdk);
  awsMock.mock("SNS", "publish", "test-message");
}

export async function resetSnsMock() {
  awsMock.restore();
}
