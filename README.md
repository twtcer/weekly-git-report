# Git 周报生成工具 🚀

> 告别繁琐的周报整理！一键生成优雅的 Git 提交周报，让汇报工作更轻松、更高效。

## ✨ 亮点特色

- 🎯 **一键生成**：告别手动整理，几秒钟生成完整周报
- 📊 **多仓库支持**：同时统计多个项目的提交记录，全面展现工作成果
- 🎨 **优雅输出**：自动分类整理，清晰展示每个项目的工作内容
- 🔍 **智能过滤**：自动过滤 Merge 记录等干扰信息
- ⚙️ **灵活配置**：支持自定义时间范围、输出路径等
- 👥 **团队协作**：可按开发者筛选，支持团队成员各自生成周报

## 🎉 解决什么问题？

- 😫 每周整理工作内容耗时费力？
- 🤔 经常忘记自己做过什么改动？
- 📝 需要在多个项目间切换查看提交记录？
- 🕒 赶在周会前匆忙准备周报？

有了这个工具，这些问题都将迎刃而解！只需简单配置，一键运行，即可生成规范、完整的周报，让你的工作汇报更加专业和高效。

## 🛠 安装说明

1. 克隆项目到本地
   ```bash
   git clone git@github.com:llt3677/weekly-git-report.git
   cd weekly-git-report
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

## ⚙️ 配置说明

在项目根目录创建 `config.json` 文件：

```json
{
    "outputPath": "./reports",
    "username": "",
    "timeRange": "week", // 支持week，month
    "startDate":"2025-04-01",
    "outputFormat": {
        "projectTitle": "## {projectName}",
        "dateRange": "时间范围: {startDate} 至 {endDate}",
        "commitFormat": "- [{date}] {message}",
        "noCommitMessage": "### {projectName} 没有提交记录",
        "dateFormat": "YYYY-MM-DD"
    },
    "projects": [
        {
            "path": "rootpath",
            "subProjects": [
                {
                    "name": "app1",
                    "path": "" // 相对路径
                },
                {
                    "name": "app2",
                    "path": ""
                }
                ,
                {
                    "name": "app3",
                    "path": ""
                }
            ]
        }        
    ],
    "excludeMessages": [
        "^Merge",
        "^chore:"
    ]
}
```

### 配置项说明

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| outputPath | 报告输出目录 | "./reports" |
| username | Git 提交用户名 | "your-git-username" |
| timeRange | 统计时间范围 | "week"（可选：day/week/month） |
| outputFormat | 输出格式配置 | 见下方详细说明 |
| projects | 项目列表配置 | 见下方详细说明 |
| excludeMessages | 需要排除的提交信息 | ["^Merge", "^chore:"] |

#### outputFormat 详细说明
- projectTitle: 项目标题格式
- dateRange: 日期范围显示格式
- commitFormat: 提交记录显示格式
- noCommitMessage: 无提交记录时的提示
- dateFormat: 日期格式化模板

#### projects 配置示例
```json
"projects": [
        {
            "path": "rootpath",
            "subProjects": [
                {
                    "name": "app1",
                    "path": "" // 相对路径
                },
                {
                    "name": "app2",
                    "path": ""
                }
                ,
                {
                    "name": "app3",
                    "path": ""
                }
            ]
        }        
    ]
```

## 🚀 使用方法

运行以下命令生成报告：

```bash
yarn start # 默认当前周报
yarn start:week # 周报
yarn start:month # 月报
```

## 📝 输出示例

```
报告生成日期: 2024-03-21

## 测试项目1
时间范围: 2024-03-14 至 2024-03-21

- [2024-03-21] 修复登录问题
- [2024-03-20] 优化性能
- [2024-03-19] 添加新功能

## 测试项目2
时间范围: 2024-03-14 至 2024-03-21

- [2024-03-21] 更新文档
- [2024-03-18] 修复 bug
```

## 📌 注意事项

1. Windows 系统中路径使用正斜杠'/'而不是反斜杠'\'
2. 确保配置的项目路径正确且为有效的 Git 仓库
3. Git 用户名需要与仓库提交记录中的作者名称完全匹配

## 🔧 依赖项

- Node.js >= 12.0.0
- moment-timezone
- child_process
- fs
- path

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
