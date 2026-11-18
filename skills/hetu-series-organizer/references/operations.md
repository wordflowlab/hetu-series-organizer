# 操作地图

由正式清单生成，执行前发现当前安装版Schema。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找专业工程 |  | read |
| get_project | 读取固定专业工程 | object_id | read |
| save_project | 保存完整专业工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| put_member | 维护系列成员 | object_id, expected_revision, expected_sha256, operation_key, member | managed_write |
| remove_member | 移除系列成员 | object_id, expected_revision, expected_sha256, operation_key, member_id | managed_write |
| put_relation | 维护作品关系 | object_id, expected_revision, expected_sha256, operation_key, relation | managed_write |
| remove_relation | 移除作品关系 | object_id, expected_revision, expected_sha256, operation_key, relation_id | managed_write |
| put_appearance | 维护角色出演 | object_id, expected_revision, expected_sha256, operation_key, appearance | managed_write |
| remove_appearance | 移除角色出演 | object_id, expected_revision, expected_sha256, operation_key, appearance_id | managed_write |
| put_plan | 维护创作计划 | object_id, expected_revision, expected_sha256, operation_key, plan | managed_write |
| remove_plan | 移除创作计划 | object_id, expected_revision, expected_sha256, operation_key, plan_id | managed_write |
| get_series_map | 读取系列与阅读顺序 | object_id | read |
| check_series | 检查引用、顺序与出演 | object_id | read |
| inspect_member_link | 核验本作品的宿主固定关联 | object_id, member_id | read |
| get_source | 读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定上游专业依据 | object_id, basis_index | read |
| compare_versions | 比较专业修订 | object_id, from_revision, to_revision | read |
| export_project | 导出固定专业报告 | object_id, format | read |
| build_context | 准备有界专业上下文 | object_id, goal, max_chars | read |
| create_handoff | 生成固定专业交接 | object_id, goal | read |
| get_operation | 沿原键回读操作 | operation_key | read |
