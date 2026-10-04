@echo off
echo ======================================================================
echo  Student Management System (Core Java + MySQL JDBC Edition)
echo ======================================================================

if not exist "backend\bin" mkdir backend\bin

echo Compiling Java source files with MySQL Connector...
javac -cp "backend\lib\*;backend\src" -d backend\bin backend\src\com\krrish\studentmanagement\model\*.java backend\src\com\krrish\studentmanagement\exception\*.java backend\src\com\krrish\studentmanagement\comparator\*.java backend\src\com\krrish\studentmanagement\util\*.java backend\src\com\krrish\studentmanagement\dao\*.java backend\src\com\krrish\studentmanagement\service\*.java backend\src\com\krrish\studentmanagement\Main.java

if %ERRORLEVEL% EQU 0 (
    echo Compilation Successful!
    echo Starting Application connected to MySQL...
    java -cp "backend\bin;backend\lib\*" com.krrish.studentmanagement.Main
) else (
    echo [ERROR] Compilation failed.
)
pause
