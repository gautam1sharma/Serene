@REM Maven Wrapper script for Windows
@REM Adapted from https://github.com/apache/maven-wrapper
@echo off
setlocal

set WRAPPER_JAR="%~dp0\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"
set MAVEN_PROJECTBASEDIR=%~dp0

if not exist "%~dp0\.mvn\wrapper\maven-wrapper.jar" (
    echo Downloading Maven Wrapper...
    powershell -Command "Invoke-WebRequest -Uri %WRAPPER_URL% -OutFile '%~dp0\.mvn\wrapper\maven-wrapper.jar'"
)

"%JAVA_HOME%\bin\java.exe" -jar %WRAPPER_JAR% %* 2>nul
if %ERRORLEVEL% neq 0 (
    java -jar %WRAPPER_JAR% %*
)

endlocal
