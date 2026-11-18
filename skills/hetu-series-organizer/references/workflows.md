# 专业流程

1. 分别读取各作品的固定资料与精确管理引用，登记成员的真实WorkRef、资料修订和摘要；不能用示例或猜测摘要代替来源。

2. 创建reading_order关系后运行 check_series 和 get_series_map。前传、平行故事与续作关系可以共存，阅读顺序不等于世界内时间顺序。

3. 角色出演以series_character_id作跨作概念映射，保留每作local_entity_ref与interpretation。不同改编解释不自动变为共享正典。

4. 已有宿主作品关联可填host_link_id及固定修订，并用 inspect_member_link 核对。外部fixed_ref只作引用；需要读另一作品时回到宿主并携带它自己的management_ref。

5. 番外计划必须选择已登记target_member，列明source_member_ids、目标及约束。只向目标作品交接；不得把当前作品权限扩到整系列。

## 发现、保存与接续

先读本包Skill及operations，再从实际Schema组装输入。新建预期修订为0；已有工程先读get_project，再提交expected_revision、expected_sha256与原operation_key。保存后get_project回读固定成果。使用get_basis/get_source读取确切依据，build_context控制上下文预算且披露省略，create_handoff固定专业引用。

停用或升级后重新发现。响应未知先get_operation；明确not_found才沿原输入原键恢复。作者在GUI修改导致CAS冲突时保留自己的输入，读取新基线并比较，不覆盖作者新稿。

跨插件接续使用固定basis_refs；上游新修订不会改写旧依据。专业状态、解析成功、文件解码及自动检查均不等于内容认可、正式设定、正文采纳或定稿。
