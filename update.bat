@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================
echo   海克斯大乱斗助手 - 更新
echo ========================
echo.

git add -A

set /p msg="请输入更新说明（直接回车使用默认）: "
if "%msg%"=="" set msg=更新代码

git commit -m "%msg%"
git push

echo.
echo ✅ 更新完成！Vercel 将在 1-2 分钟内自动部署
echo.
pause
