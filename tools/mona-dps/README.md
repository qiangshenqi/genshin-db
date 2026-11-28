# 莫娜占卜铺增强版（TwiceDrop）本地接入

用于补齐 gcsim 尚未实现的 **米提亚 / 瓦列里 / 薇斯纳** 等角色的公式/固定轴 DPS。

## 已落地

| 路径 | 用途 |
|------|------|
| `tools/genshin-artifact/` | 完整源码（含 team-engine） |
| `tools/mona-artifact-app/genshin_artifact_V7.2.06.04_tauri_x64.exe` | Windows GUI |
| `tools/mona-dps/run-preset.mjs` | 命令行跑上游预设轴 |

## CLI

```bash
node tools/mona-dps/run-preset.mjs list
node tools/mona-dps/run-preset.mjs mitya
node tools/mona-dps/run-preset.mjs vesna
```

## 覆盖情况

- **已实现**：米提亚 `Mitya`、瓦列里 `Valeriy`、薇斯纳 `Vesna`（另有沃雅妮莎等，与 gcsim 重叠）
- **未实现**：**洛恩 `Lohen`** — 仓库仅有立绘/图标，无 Rust 角色包、无动作轴

正式配装与联合搜索请直接开 GUI。
