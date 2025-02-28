#!/bin/bash

# 进入脚本所在目录
cd "$(dirname "$0")"

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未安装 Node.js，请先安装 Node.js"
    read -p "按任意键退出..."
    exit 1
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
fi

# 运行周报生成程序
echo "正在生成周报..."
node weekly-report.js

# 等待用户按键后退出
echo "按任意键退出..."
read -n 1 -s 