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
        let startDate;

        // 根据配置的时间范围设置起始日期
        switch(config.timeRange) {
            case 'day':
                startDate = today.clone().subtract(1, 'days');
                break;
            case 'month':
                startDate = today.clone().subtract(1, 'months');
                break;
            case 'week':
            default:
                startDate = today.clone().subtract(7, 'days');
        }

        // 获取指定时间范围内指定用户的所有提交
        const gitLog = execSync(`git log --since="${startDate.format(config.outputFormat.dateFormat)}" --author="${config.username}" --format="%ad|%s" --date=format:"${config.outputFormat.dateFormat}"`)
            .toString()
            .trim();

        if (!gitLog) {
            return `\n${config.outputFormat.noCommitMessage.replace('{projectName}', projectName)}\n`;
        }

        let report = `\n${config.outputFormat.projectTitle.replace('{projectName}', projectName)}\n`;
        report += `${config.outputFormat.dateRange.replace('{startDate}', startDate.format(config.outputFormat.dateFormat)).replace('{endDate}', today.format(config.outputFormat.dateFormat))}\n\n`;

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
                dailyCommits[date].forEach(message => {
                    report += config.outputFormat.commitFormat
                        .replace('{date}', date)
                        .replace('{message}', message) + '\n';
                });
            });

        return report;
    } catch (error) {
        return `\n${projectName}发生错误: ${error.message}\n`;
    }
}

// 生成所有项目的报告
function generateAllReports() {
    const reportDate = moment().format(config.outputFormat.dateFormat);
    let allReports = `报告生成日期: ${reportDate}\n`;

    for (const project of config.projects) {
        allReports += generateWeeklyReport(project.path, project.name);
    }

    // 确保输出目录存在
    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath, { recursive: true });
    }

    // 写入文件
    const reportPath = path.join(config.outputPath, `report-${reportDate}.txt`);
    fs.writeFileSync(reportPath, allReports, 'utf8');
    console.log(`报告已生成: ${reportPath}`);
}

generateAllReports();