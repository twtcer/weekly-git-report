const { execSync } = require('child_process');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

// 读取配置文件
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function generateWeeklyReport(projectPath, projectName) {
    try {
        // 切换到项目目录
        process.chdir(projectPath);

        // 检查是否是Git仓库
        try {
            execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
        } catch (error) {
            console.log(`${projectName} 不是一个有效的Git仓库`);
            return '';
        }

        // 设置时区为上海
        const tz = 'Asia/Shanghai';
        const today = moment().tz(tz);
        const weekAgo = today.clone().subtract(7, 'days');

        // 获取一周内指定用户的所有提交
        const gitLog = execSync(`git log --since="${weekAgo.format('YYYY-MM-DD')}" --author="${config.username}" --format="%ad|%s" --date=format:"%Y-%m-%d"`)
            .toString()
            .trim();

        if (!gitLog) {
            return `\n${projectName}本周没有提交记录\n`;
        }

        let report = `\n===== ${projectName}本周工作报告 =====\n`;
        report += `时间范围: ${weekAgo.format('YYYY-MM-DD')} 至 ${today.format('YYYY-MM-DD')}\n\n`;

        // 按日期分组整理提交记录
        const dailyCommits = {};
        gitLog.split('\n').forEach(line => {
            const [date, message] = line.split('|');
            // 检查是否需要排除该消息
            const shouldExclude = config.excludeMessages && config.excludeMessages.some(pattern => {
                const regex = new RegExp(pattern);
                return regex.test(message);
            });

            if (!shouldExclude) {
                if (!dailyCommits[date]) {
                    dailyCommits[date] = [];
                }
                dailyCommits[date].push(message);
            }
        });

        // 按日期生成报告内容
        Object.keys(dailyCommits)
            .sort((a, b) => b.localeCompare(a))
            .forEach(date => {
                report += `[${date}]\n`;
                dailyCommits[date].forEach(msg => {
                    report += `- ${msg}\n`;
                });
                report += '\n';
            });

        return report;
    } catch (error) {
        return `\n${projectName}发生错误: ${error.message}\n`;
    }
}

// 生成所有项目的周报
function generateAllReports() {
    const reportDate = moment().format('YYYY-MM-DD');
    let allReports = `周报生成日期: ${reportDate}\n`;

    for (const project of config.projects) {
        allReports += generateWeeklyReport(project.path, project.name);
    }

    // 确保输出目录存在
    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath, { recursive: true });
    }

    // 写入文件
    const reportPath = path.join(config.outputPath, `weekly-report-${reportDate}.txt`);
    fs.writeFileSync(reportPath, allReports, 'utf8');
    console.log(`周报已生成: ${reportPath}`);
}

generateAllReports();