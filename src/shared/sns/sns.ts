import * as awsSdk from "aws-sdk";

awsSdk.config.update({ region: process.env.REGION_NAM });

export async function sendToSNS(message: string) {
  const sns = new awsSdk.SNS({ apiVersion: "2010-03-31" });
  const params = {
    Message: message,
    TopicArn: String(process.env.SNS_TOPIC_ARN),
  };

  await sns.publish(params).promise();
}
