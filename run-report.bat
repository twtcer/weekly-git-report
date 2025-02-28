@echo off
chcp 65001 >nul

:: 进入脚本所在目录
cd /d "%~dp0"

:: 检查是否安装了 Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未安装 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

:: 检查是否安装了依赖
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
)

:: 运行周报生成程序
echo 正在生成周报...
node weekly-report.js

:: 获取今天的日期
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set date=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

:: 打开生成的报告文件
start "" "reports\report-%date%.txt"

:: 延迟1秒后关闭窗口
timeout /t 1 /nobreak > nul
exit 