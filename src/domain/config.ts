export const config = {
  fields: {
    member: "members",
    relation: "relations",
    appearance: "appearances",
    plan: "plans",
  },
  defaults: { members: [], relations: [], appearances: [], plans: [] },
  tabs: ["系列作品", "阅读顺序", "角色出演", "番外计划", "接续创作"],
} as const;
