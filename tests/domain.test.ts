import assert from "node:assert/strict";
import { test } from "node:test";
import {
  scenario,
  original,
  range,
  cardFile,
  cardJSON,
  wav,
  sha,
} from "./support/scenario.ts";
import {
  validateDomain,
  readingOrder,
  readProfessional,
} from "../src/domain/professional.ts";
test("同名作品按身份区分并保持阅读顺序", () => {
  const p = scenario();
  p.members[1].title = p.members[0].title;
  validateDomain(p);
  assert.deepEqual(readingOrder(p), ["main", "side"]);
});
test("阅读顺序成环拒绝，平行关系可共存", () => {
  const p = scenario();
  p.relations.push({
    id: "back",
    from_member: "side",
    to_member: "main",
    kind: "reading_order",
    note: "",
  });
  assert.throws(() => validateDomain(p));
  p.relations[1].kind = "parallel";
  validateDomain(p);
});
test("同人物在不同作品中可以保留不同解释", () => {
  const p = scenario();
  p.appearances.push({
    ...p.appearances[0],
    id: "lin-side",
    member_id: "side",
    local_entity_ref: "character_other",
    interpretation: "平行故事中的寄信人",
  });
  validateDomain(p);
  assert.equal(p.appearances.length, 2);
});
test("删除被引用成员与未登记番外目标拒绝", () => {
  const p = scenario();
  p.members.pop();
  assert.throws(() => validateDomain(p));
  const q = scenario();
  q.plans[0].target_member = "absent";
  assert.throws(() => validateDomain(q));
});
test("外部引用不伪装读取授权，宿主关联不匹配拒绝", async () => {
  const p = scenario();
  await assert.rejects(() =>
    readProfessional("inspect_member_link", p, [], { member_id: "side" }),
  );
  p.members[1].host_link_id = "worklink_x";
  p.members[1].host_link_revision = 1;
  await assert.rejects(() =>
    readProfessional(
      "inspect_member_link",
      p,
      [],
      { member_id: "side" },
      async () => ({
        status: "succeeded",
        data: { link: { source_ref: {}, target_ref: {} } },
      }),
    ),
  );
});
test("固定宿主关联核验不返回他作正文或管理引用", async () => {
  const p = scenario();
  p.members[1].host_link_id = "worklink_x";
  p.members[1].host_link_revision = 1;
  const r: any = await readProfessional(
    "inspect_member_link",
    p,
    [],
    { member_id: "side" },
    async () => ({
      status: "succeeded",
      data: {
        link: {
          link_id: "worklink_x",
          revision: 1,
          source_ref: p.members[1].fixed_ref,
          target_ref: p.members[0].fixed_ref,
        },
        sha256: "c".repeat(64),
      },
    }),
  );
  assert.equal(r.member_id, "side");
  assert.equal(JSON.stringify(r).includes("management_ref"), false);
  assert.equal(r.related_status, "requires_separate_authorization");
});
