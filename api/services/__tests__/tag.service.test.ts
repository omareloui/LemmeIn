import { ServiceTester } from "./service.test.helper.ts";
import { assertEquals } from "../../deps.ts";

import TagService from "../tag.service.ts";

const serviceTester = new ServiceTester("tag", TagService);
const serviceTesterDuplication = new ServiceTester("tag", TagService);

serviceTester.testCreateMine({ tag: "testingTag", color: "#fff" });
serviceTester.testGetAllMine();
serviceTester.testGetOneMine();

serviceTester.test(
  "should normalize all tags with passwords count",
  async () => {
    if (!serviceTester.service.getAllMine)
      throw new Error("This service doesn't have getOneMine");
    const records = await serviceTester.service.getAllMine(
      serviceTester.userId
    );
    assertEquals(Object.hasOwn(records[0], "passwordsCount"), true);
  }
);

serviceTester.testAsyncError(
  "should throw error on creating new testing with the same name",
  async () => {
    await TagService.createMine(
      { tag: "testingTag", color: "#123" },
      serviceTester.userId
    );
  },
  "already exists"
);

serviceTester.testUpdateOneMine({ tag: "testingTag" });
serviceTester.testUpdateOneMine({ color: "#ooo" });
serviceTester.testUpdateOneMine({ tag: "updatedTag" });

serviceTesterDuplication.testCreateMine({ tag: "shouldNotDuplicate" });
serviceTester.testAsyncError(
  "should throw error on updating tag with a name that another tag holds",
  async () => {
    await TagService.updateOneMine(
      serviceTester.createdRecordId!,
      { tag: "shouldNotDuplicate" },
      serviceTester.userId
    );
  },
  "can't duplicate it"
);

serviceTester.testRemovingOneMine();
serviceTesterDuplication.testRemovingOneMine();
