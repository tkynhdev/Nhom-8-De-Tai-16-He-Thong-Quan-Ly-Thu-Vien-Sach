@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set WRAPPER_DIR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper
set MAVEN_VERSION=3.9.9
set MAVEN_DIST_DIR=%WRAPPER_DIR%\dists\apache-maven-%MAVEN_VERSION%
set MAVEN_CMD=%MAVEN_DIST_DIR%\bin\mvn.cmd
set MAVEN_ZIP=%WRAPPER_DIR%\dists\apache-maven-%MAVEN_VERSION%-bin.zip
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

if not exist "%MAVEN_CMD%" (
  if not exist "%WRAPPER_DIR%\dists" mkdir "%WRAPPER_DIR%\dists"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'; Expand-Archive -LiteralPath '%MAVEN_ZIP%' -DestinationPath '%WRAPPER_DIR%\dists' -Force } catch { Write-Error $_; exit 1 }"
  if errorlevel 1 exit /b 1
)

"%MAVEN_CMD%" %*
endlocal
