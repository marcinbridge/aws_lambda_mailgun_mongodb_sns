import { CqrsServiceImpl } from "../../../src/shared/services/ioc-services";
import { should } from "chai";
import { APIGatewayEventRequestContext } from "aws-lambda";
should();

describe("IOC services", () => {
  it(`should return empty object`, async () => {
    let context: APIGatewayEventRequestContext;
    let instance = new CqrsServiceImpl();
    // @ts-ignore
    instance.handle(context, { test: "test" });
    instance.should.be.empty;
  });
});
