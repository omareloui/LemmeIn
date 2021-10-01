import { ServiceTester } from "./service.test.helper.ts";
import TagService from "../tag.service.ts";

const serviceTester = new ServiceTester("tag", TagService);
const serviceTesterDuplication = new ServiceTester("tag", TagService);

serviceTester.testCreateMine({ name: "testingTag", color: "#fff" });
serviceTester.testGetAllMine();
serviceTester.testGetOneMine();

serviceTester.test(
  "should normalize all tags with accounts count",
  async () => {
    if (!serviceTester.service.getAllMine)
      throw new Error("This service doesn't have getOneMine");
    const records = await serviceTester.service.getAllMine(
      serviceTester.userId
    );
    // deno-lint-ignore no-explicit-any
    serviceTester.shouldHaveProperty(records[0] as any, "accountsCount");
  }
);

serviceTester.testAsyncError(
  "should throw error on creating new testing with the same name",
  async () => {
    await TagService.createMine(
      { name: "testingTag", color: "#123" },
      serviceTester.userId
    );
  },
  "already exists"
);

serviceTester.testUpdateOneMine({ name: "testingTag" });
serviceTester.testUpdateOneMine({ color: "#ooo" });
serviceTester.testUpdateOneMine({ name: "updatedTag" });

serviceTesterDuplication.testCreateMine({ name: "shouldNotDuplicate" });
serviceTester.testAsyncError(
  "should throw error on updating tag with a name that another tag holds",
  async () => {
    await TagService.updateOneMine(
      serviceTester.createdRecordId!,
      { name: "shouldNotDuplicate" },
      serviceTester.userId
    );
  },
  "can't duplicate it"
);

serviceTester.testRemovingOneMine();
serviceTesterDuplication.testRemovingOneMine();
