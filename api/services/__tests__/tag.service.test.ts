import { ServiceTest } from "./service.test.helper.ts";
import TagService from "../tag.service.ts";

const serviceTest = new ServiceTest("tag", TagService);
const serviceTestDuplication = new ServiceTest("tag", TagService);

serviceTest.testCreateForMe({ tag: "testingTag", color: "#fff" });
serviceTest.testGetAllMine();
serviceTest.testGetOneMine();

serviceTest.testAsyncError(
  "should throw error on creating new testing with the same name",
  async () => {
    await TagService.createForMe(
      { tag: "testingTag", color: "#123" },
      serviceTest.userId
    );
  },
  "already exists"
);

serviceTest.testUpdateOneMine({ tag: "testingTag" });
serviceTest.testUpdateOneMine({ color: "#ooo" });
serviceTest.testUpdateOneMine({ tag: "updatedTag" });

serviceTestDuplication.testCreateForMe({ tag: "shouldNotDuplicate" });
serviceTest.testAsyncError(
  "should throw error on updating tag with a name that another tag holds",
  async () => {
    await TagService.updateOneMine(
      serviceTest.createdRecordId!,
      { tag: "shouldNotDuplicate" },
      serviceTest.userId
    );
  },
  "can't duplicate it"
);

serviceTest.testRemovingOneMine();
serviceTestDuplication.testRemovingOneMine();
