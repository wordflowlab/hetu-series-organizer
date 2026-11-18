import {
  requireValue as need,
  canonical,
  data,
} from "../../vendor/project-store.ts";
export function readingOrder(p: any) {
  const edges = p.relations.filter((r: any) => r.kind === "reading_order"),
    degree = new Map<string, number>(p.members.map((m: any) => [m.id, 0]));
  for (const e of edges) degree.set(e.to_member, degree.get(e.to_member)! + 1);
  const queue = p.members
      .filter((m: any) => degree.get(m.id) === 0)
      .map((m: any) => m.id),
    order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const e of edges.filter((e: any) => e.from_member === id)) {
      degree.set(e.to_member, degree.get(e.to_member)! - 1);
      if (degree.get(e.to_member) === 0) queue.push(e.to_member);
    }
  }
  need(
    order.length === p.members.length,
    "阅读顺序成环，请保留明确的先后关系。",
  );
  return order;
}
export function validateDomain(p: any) {
  const members = new Set(p.members.map((m: any) => m.id)),
    identities = p.members.map((m: any) => canonical(m.fixed_ref.work_ref));
  need(
    new Set(identities).size === identities.length,
    "同一作品不能重复登记为不同成员。",
  );
  for (const m of p.members)
    need(
      (m.host_link_id === null) === (m.host_link_revision === null),
      "宿主关联须同时固定ID和修订。",
    );
  for (const r of p.relations)
    need(
      members.has(r.from_member) &&
        members.has(r.to_member) &&
        r.from_member !== r.to_member,
      "作品关系引用无效。",
    );
  need(
    new Set(
      p.relations.map((r: any) =>
        canonical([r.from_member, r.to_member, r.kind]),
      ),
    ).size === p.relations.length,
    "重复作品关系。",
  );
  for (const a of p.appearances)
    need(members.has(a.member_id), "出演引用的作品不存在。");
  for (const plan of p.plans) {
    need(members.has(plan.target_member), "番外目标作品未登记。");
    need(
      new Set(plan.source_member_ids).size === plan.source_member_ids.length,
      "番外来源作品重复。",
    );
    for (const id of plan.source_member_ids)
      need(members.has(id), "番外来源作品未登记。");
  }
  readingOrder(p);
}
export async function checkSources(_p: any, _sources: any[], _request?: any) {}
export function pureAction(_action: string, _i: any) {
  return undefined;
}
export async function readProfessional(
  action: string,
  p: any,
  _sources: any[],
  i: any,
  request?: any,
) {
  if (action === "get_series_map")
    return {
      members: p.members,
      relations: p.relations,
      reading_order: readingOrder(p),
      appearances: p.appearances,
      plans: p.plans,
      note: "成员是固定引用；角色出演不合并正式设定，跨作品读取须分别获权。",
    };
  if (action === "check_series")
    return {
      valid: true,
      reading_order: readingOrder(p),
      reference_only_members: p.members
        .filter((m: any) => !m.host_link_id)
        .map((m: any) => m.id),
      cross_work_access: "separate_management_refs_required",
      shared_canon: false,
    };
  if (action === "inspect_member_link") {
    const m = p.members.find((m: any) => m.id === i.member_id);
    need(m, "成员不存在。");
    need(
      m.host_link_id,
      "该成员只有外部固定引用；请沿该作品自己的管理引用读取，当前调用不扩大范围。",
      "forbidden",
    );
    const view = data(
      await request("hetu.work_links.get", {
        link_id: m.host_link_id,
        revision: m.host_link_revision,
      }),
    );
    const link = view.link;
    need(
      link &&
        [link.source_ref, link.target_ref].some(
          (r: any) => canonical(r) === canonical(m.fixed_ref),
        ),
      "宿主关联与成员固定依据不一致。",
      "hetu.stale_evidence",
    );
    return {
      member_id: m.id,
      link_ref: {
        link_id: link.link_id,
        revision: link.revision,
        sha256: view.sha256,
      },
      fixed_ref: m.fixed_ref,
      related_status: view.related_status ?? "requires_separate_authorization",
      note: "关联核验只证明固定关系存在，不代表已读取另一作品的正文或当前资料。",
    };
  }
}
