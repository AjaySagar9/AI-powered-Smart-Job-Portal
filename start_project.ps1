$ErrorActionPreference = "Stop"

Write-Host "Checking prerequisites..." -ForegroundColor Cyan

# 1. Check Docker
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Docker daemon is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: Docker is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 2. Check Java
try {
    $javaInfo = java -version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Java is not installed." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: Java is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 3. Check Maven
$mvnCmd = "mvn"
try {
    $mvnVersion = mvn -v 2>&1
} catch {
    Write-Host "Maven not found in PATH. Checking if we can use Docker to build..." -ForegroundColor Yellow
    # We will use docker for maven build
    $mvnCmd = "docker"
}

Write-Host "Starting infrastructure (Postgres, Redis, RabbitMQ, Elasticsearch)..." -ForegroundColor Cyan
cd Backend
docker-compose up -d

Write-Host "Building backend microservices..." -ForegroundColor Cyan
if ($mvnCmd -eq "mvn") {
    mvn clean install -DskipTests
} else {
    docker run --rm -v "$PWD:/usr/src/mymaven" -v "$env:USERPROFILE/.m2:/root/.m2" -w /usr/src/mymaven maven:3.9.6-eclipse-temurin-21 mvn clean install -DskipTests
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Maven build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Discovery Server..." -ForegroundColor Cyan
Start-Process java -ArgumentList "-jar target/discovery-server-1.0.0-SNAPSHOT.jar" -WorkingDirectory "discovery-server" -WindowStyle Normal

Start-Sleep -Seconds 10

Write-Host "Starting API Gateway..." -ForegroundColor Cyan
Start-Process java -ArgumentList "-jar target/api-gateway-1.0.0-SNAPSHOT.jar" -WorkingDirectory "api-gateway" -WindowStyle Normal

Start-Sleep -Seconds 10

$services = @("auth-service", "user-service", "job-service", "resume-service", "application-service", "notification-service", "ai-service")

foreach ($service in $services) {
    Write-Host "Starting $service..." -ForegroundColor Cyan
    # find the jar file in the target directory of the service
    $jarName = "$service-1.0.0-SNAPSHOT.jar"
    Start-Process java -ArgumentList "-jar target/$jarName" -WorkingDirectory $service -WindowStyle Normal
    Start-Sleep -Seconds 2
}

cd ..

Write-Host "Starting Frontend..." -ForegroundColor Cyan
cd Frontend
npm install
Start-Process npm -ArgumentList "run dev" -WorkingDirectory "." -WindowStyle Normal

Write-Host "All services started! The backend microservices and frontend are running in separate windows." -ForegroundColor Green
Write-Host "You can close those windows to stop the services, and run 'docker-compose down' in the Backend folder to stop the databases." -ForegroundColor Green

