const { execSync } = require('child_process');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

// 读取配置文件
function loadConfig() {
    try {
        return JSON.parse(fs.readFileSync('config.json', 'utf8'));
    } catch (error) {
        throw new Error(`配置文件读取失败: ${error.message}`);
    }
}

// 验证配置
function validateConfig(config) {
    const requiredFields = ['timeRange', 'outputPath', 'projects']; //  'username',
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`配置缺少必要字段: ${missingFields.join(', ')}`);
    }
}

// 获取日期范围
function getDateRange(timeRange, tz = 'Asia/Shanghai') {
    const today = moment().tz(tz);
    let startDate, endDate;

    switch(timeRange) {
        case 'day':
            startDate = today.clone().subtract(1, 'days');
            endDate = today.clone();
            break;
        case 'month':
            startDate = today.clone().subtract(1, 'months');
            endDate = today.clone();
            break;
        case 'week':
        default:
            // 如果今天是周末，获取上周五
            endDate = today.clone();
            if (today.day() === 0) { // 周日
                endDate.subtract(2, 'days'); // 回到周五
            } else if (today.day() === 6) { // 周六
                endDate.subtract(1, 'days'); // 回到周五
            } else if (today.day() === 5) { // 如果是周五，不变
                // do nothing
            } else {
                endDate.day(5); // 设置为本周五
            }
            
            // 从结束日期（周五）往前推到对应的周一
            startDate = endDate.clone().day(1);
            break;
    }

    return { startDate, endDate };
}

// 获取Git提交记录
function getGitCommits(projectPath, startDate, config) {
    try {
        process.chdir(projectPath);
        const dateFormat = config.outputFormat.dateFormat || 'YYYY-MM-DD';
        const author=config.username.length>0?`--author="${config.username}"`:"";
        const gitCommand = `git log --since="${startDate.format(dateFormat)}" ${author} --format="%cd|%s" --date=format:"%Y-%m-%d"`;
        console.log('执行Git命令:', gitCommand);
        const result = execSync(gitCommand, { encoding: 'utf8' }).trim();
        if (!result) {
            console.log('没有找到符合条件的提交记录');
            return '';
        }
        console.log('Git命令结果:', result);
        return result;
    } catch (error) {
        throw new Error(`获取Git提交记录失败: ${error.message}`);
    }
}

// 处理提交记录
function processCommits(gitLog, config) {
    const dailyCommits = {};
    
    gitLog.split('\n').forEach(line => {
        if (!line) return;
        
        const [date, message] = line.split('|');
        const shouldExclude = config.excludeMessages?.some(pattern => 
            new RegExp(pattern).test(message)
        );

        if (!shouldExclude) {
            if (!dailyCommits[date]) {
                dailyCommits[date] = [];
            }
            dailyCommits[date].push(message);
        }
    });

    return dailyCommits;
}

function generateWeeklyReport(projectPath, projectName, config) {
    try {
        // 检查是否是Git仓库
        try {
            execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
        } catch {
            console.warn(`警告: ${projectName} 不是一个有效的Git仓库`);
            return '';
        }

        const { startDate, endDate } = getDateRange(config.timeRange);
        const gitLog = getGitCommits(projectPath, startDate, config);

        if (!gitLog) {
            return `\n${config.outputFormat.noCommitMessage.replace('{projectName}', projectName)}\n`;
        }

        const dailyCommits = processCommits(gitLog, config);
        
        // 生成报告
        let report = `\n${config.outputFormat.projectTitle.replace('{projectName}', projectName)}\n`;
        report += `${config.outputFormat.dateRange
            .replace('{startDate}', startDate.format(config.outputFormat.dateFormat))
            .replace('{endDate}', endDate.format(config.outputFormat.dateFormat))}\n\n`;

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
        console.error(`处理项目 ${projectName} 时发生错误:`, error);
        return `\n${projectName} 处理失败: ${error.message}\n`;
    }
}

async function generateAllReports() {
    try {
        const config = loadConfig();
        validateConfig(config);

        const reportDate = moment().format(config.outputFormat.dateFormat);
        let allReports = `报告生成日期: ${reportDate}\n`;

        for (const project of config.projects) {
            const originalCwd = process.cwd();
            const report = generateWeeklyReport(project.path, project.name, config);
            process.chdir(originalCwd);
            allReports += report;
        }

        // 确保输出目录存在
        await fs.promises.mkdir(config.outputPath, { recursive: true });

        // 写入文件
        const reportPath = path.join(config.outputPath, `report-${reportDate}.txt`);
        await fs.promises.writeFile(reportPath, allReports, 'utf8');
        console.log(`报告已成功生成: ${reportPath}`);
    } catch (error) {
        console.error('生成报告失败:', error);
        process.exit(1);
    }
}

// 启动程序
generateAllReports();