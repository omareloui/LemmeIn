import { assertEquals, assertMatch } from "../../deps.ts";
import { Test } from "../../helpers/test.helper.ts";

import { BaseService } from "../base.service.ts";

export class ServiceTest<ServiceType extends typeof BaseService> extends Test {
  service: ServiceType;
  createdRecordId: string | null;

  constructor(
    public serviceName: string,
    Service: ServiceType,
    public userId = "testing_user_id"
  ) {
    super(`service/${serviceName}:`);
    this.service = Service;
    this.createdRecordId = null;
  }

  public testCreateMine(data: Record<string, unknown>) {
    this.test(`should create ${this.serviceName}`, async () => {
      if (!this.service.createMine)
        throw new Error("This service doesn't have createForMe");
      this.createdRecordId = await this.service.createMine(data, this.userId);
      assertMatch(this.createdRecordId, /^[\da-f]{24}$/);
    });
  }

  public testGetAllMine() {
    this.test(`should get all ${this.serviceName}`, async () => {
      if (!this.createdRecordId)
        throw new Error("No record was provided to test deleting");
      if (!this.service.getAllMine)
        throw new Error("This service doesn't have getOneMine");
      const records = await this.service.getAllMine(this.userId);
      assertEquals(Object.hasOwn(records[0], "id"), true);
    });
  }

  public testGetOneMine() {
    this.test(`should get the created ${this.serviceName}`, async () => {
      if (!this.createdRecordId)
        throw new Error("No record was provided to test getting it");
      if (!this.service.getOneMine)
        throw new Error("This service doesn't have getOneMine");
      const record = await this.service.getOneMine(
        this.createdRecordId,
        this.userId
      );
      assertEquals(Object.hasOwn(record, "id"), true);
    });
  }

  public testUpdateOneMine(newData: Record<string, unknown>) {
    this.test(`should update the created ${this.serviceName}`, async () => {
      if (!this.createdRecordId)
        throw new Error("No record was provided to test updating");
      if (!this.service.updateOneMine)
        throw new Error("This service doesn't have updateOneMine");
      const newRecord = await this.service.updateOneMine(
        this.createdRecordId,
        newData,
        this.userId
      );
      Object.keys(newData).forEach((key) => {
        assertEquals(newRecord[key] === newData[key], true);
      });
    });
  }

  public testRemovingOneMine() {
    this.test("should delete the created password", async () => {
      if (!this.createdRecordId)
        throw new Error("No record was provided to test deleting");
      if (!this.service.removeOneMine)
        throw new Error("This service doesn't have removeOneMine");
      const deletionCount = await this.service.removeOneMine(
        this.createdRecordId,
        this.userId
      );
      assertEquals(deletionCount, 1);
    });
  }
}
