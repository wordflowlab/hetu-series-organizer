import { names } from "../domain/report.ts";
const label = (v: string) => names[v] ?? v;
const member = (p: any, id: string) =>
  p.members?.find((v: any) => v.id === id)?.title ?? "未找到作品";
export function rowTitle(field: string, v: any, p: any): string {
  if (field === "relations")
    return member(p, v.from_member) + " → " + member(p, v.to_member);
  if (field === "appearances")
    return v.name + "（" + member(p, v.member_id) + "）";
  return v.title ?? v.name ?? v.source ?? v.label ?? v.marker ?? "记录";
}
export function rowContent(field: string, v: any, p: any): any {
  if (field === "members")
    return {
      作品角色: label(v.role),
      简介: v.summary,
      固定资料修订: v.fixed_ref.revision_ref.revision,
      关联方式: v.host_link_id ? "已登记宿主关联" : "外部固定引用",
    };
  if (field === "relations") return { 关系: label(v.kind), 说明: v.note };
  if (field === "appearances")
    return { 作品内解释: v.interpretation, 阶段: label(v.status) };
  if (field === "plans")
    return {
      目标作品: member(p, v.target_member),
      参考作品: v.source_member_ids.map((id: string) => member(p, id)),
      创作目标: v.goal,
      约束: v.constraints,
      状态: label(v.status),
    };
  const { id, title, name, ...rest } = v;
  return rest;
}
export function panelContent(action: string, v: any, p: any): any {
  if (action === "get_series_map")
    return {
      阅读顺序: v.reading_order.map((id: string) => member(p, id)),
      作品关系: v.relations.map((r: any) => ({
        起点: member(p, r.from_member),
        后续: member(p, r.to_member),
        关系: label(r.kind),
        说明: r.note,
      })),
      说明: v.note,
    };
  return v;
}
