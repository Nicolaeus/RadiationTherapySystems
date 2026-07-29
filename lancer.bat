@echo off
title Accelerator Viewer

cd /d "%~dp0"

cls

echo ================================================================
echo                 ACCELERATOR VIEWER
echo            Radiotherapy Equipment Database
echo ================================================================
echo.
echo Portable Edition
echo.

:: -----------------------------------------------------------------
:: Verification de l'application
:: -----------------------------------------------------------------

echo [1/6] Verification de l'installation...

if not exist "app\" (
    echo.
    echo [ERREUR] Le dossier "app" est introuvable.
    echo.
    pause
    exit /b
)

if not exist "app\php\php.exe" (
    echo.
    echo [ERREUR] PHP Portable est introuvable.
    echo.
    echo Fichier attendu :
    echo    application\php\php.exe
    echo.
    pause
    exit /b
)

echo      OK

:: -----------------------------------------------------------------
:: Creation des dossiers
:: -----------------------------------------------------------------

echo.
echo [2/6] Preparation de l'environnement...

if not exist "app\logs" mkdir "app\logs"
if not exist "app\tmp" mkdir "app\tmp"

echo      OK

:: -----------------------------------------------------------------
:: Demarrage du serveur
:: -----------------------------------------------------------------

echo.
echo [3/6] Demarrage du serveur PHP...

cd app

start /B "" php\php.exe -S 127.0.0.1:8000 > logs\server.log 2>&1

timeout /t 2 /nobreak >nul

echo      OK

:: -----------------------------------------------------------------
:: Ouverture du navigateur
:: -----------------------------------------------------------------

echo.
echo [4/6] Ouverture de l'application...

start "" http://127.0.0.1:8000

echo      OK

:: -----------------------------------------------------------------
:: Informations
:: -----------------------------------------------------------------

echo.
echo [5/6] Application prete.
echo.

echo Adresse :
echo     http://127.0.0.1:8000
echo.

echo Journal du serveur :
echo     app\logs\server.log
echo.

echo ================================================================
echo.
echo L'application est maintenant en cours d'execution.
echo.
echo Pour quitter :
echo.
echo   - Fermez cette fenetre
echo   - ou lancez "arreter.bat"
echo.
echo ================================================================
echo.

:: -----------------------------------------------------------------
:: Maintien du serveur
:: -----------------------------------------------------------------

php\php.exe -S 127.0.0.1:8000