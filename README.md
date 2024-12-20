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

## 🛠️ 功能特点

- 支持多个项目仓库的提交记录统计
- 可配置时间范围（支持按天、周、月统计）
- 支持按用户筛选提交记录
- 自定义输出路径
- 支持排除特定格式的提交信息（如 Merge 提交）
- 支持自定义输出格式

## 安装说明

1. 克隆项目到本地
   ```bash
   git clone git@github.com:llt3677/weekly-git-report.git
   cd weekly-git-report
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 配置config.json:
   ```json
   {
     "outputPath": "输出目录路径",
     "username": "Git用户名",
     "timeRange": "week", // 可选值: "day"(按天), "week"(按周), "month"(按月)
     "outputFormat": {
       "projectTitle": "===== {projectName}工作报告 =====",
       "dateRange": "时间范围: {startDate} 至 {endDate}",
       "commitFormat": "{date}: {message}",
       "noCommitMessage": "{projectName}在此期间没有提交记录",
       "dateFormat": "YYYY-MM-DD"
     },
     "projects": [
       {
         "name": "项目名称",
         "path": "项目路径"
       }
     ],
     "excludeMessages": [
       "^Merge.*"
     ]
   }
   ```
   注意: Windows系统中路径需要使用正斜杠'/'而不是反斜杠'\'，例如: "E:/Code/project-name"

4. 运行程序:
   ```bash
   npm start
   ```

生成的周报将保存在配置的outputPath目录下，文件名格式为`weekly-report-YYYY-MM-DD.txt`。
