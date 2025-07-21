#!/bin/bash

echo "正在启动PDF双面工具..."
echo ""
echo "请确保您的浏览器已安装并支持现代Web标准"
echo ""
echo "支持的浏览器："
echo "- Google Chrome"
echo "- Mozilla Firefox"
echo "- Safari"
echo "- Microsoft Edge"
echo ""

# 检测操作系统并尝试打开浏览器
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v google-chrome &> /dev/null; then
        google-chrome index.html
    elif command -v firefox &> /dev/null; then
        firefox index.html
    elif command -v xdg-open &> /dev/null; then
        xdg-open index.html
    else
        echo "未找到支持的浏览器，请手动打开 index.html 文件"
    fi
else
    echo "请手动打开 index.html 文件"
fi

echo ""
echo "如果浏览器没有自动打开，请手动打开 index.html 文件" 