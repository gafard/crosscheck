@echo off
title CMS Articles CrossCheck
echo.
echo ========================================
echo    CMS ARTICLES CROSSCHECK
echo ========================================
echo.
echo Demarrage du gestionnaire d'articles...
echo.

REM Vérifier si le fichier CMS existe
if not exist "cms-articles.html" (
    echo ERREUR: Le fichier cms-articles.html n'a pas ete trouve !
    echo Assurez-vous que ce fichier est dans le meme dossier.
    pause
    exit /b 1
)

REM Ouvrir le CMS dans le navigateur par défaut
echo Ouverture du CMS dans votre navigateur...
start "" "cms-articles.html"

echo.
echo Le CMS Articles CrossCheck est maintenant ouvert dans votre navigateur.
echo.
echo INSTRUCTIONS :
echo - Remplissez le formulaire pour creer un nouvel article
echo - Les fichiers HTML seront telecharges automatiquement
echo - Placez les fichiers dans le dossier de votre site web
echo.
echo Pour fermer cette fenetre, appuyez sur une touche...
pause >nul
