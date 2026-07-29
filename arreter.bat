@echo off
title Accelerator Viewer - Stop

echo.
echo Arret du serveur...
echo.

taskkill /F /IM php.exe >nul 2>&1

echo Serveur arrete.
echo.

pause