# Backend Help

## Project layout

```text
backend/
  pom.xml
  mvnw
  mvnw.cmd
  .mvn/wrapper/maven-wrapper.properties
  .env.example
  src/
    main/java/com/library
    main/resources
    test/java/com/library
```

## Run on Windows

```powershell
.\mvnw.cmd spring-boot:run
```

## Run tests

```powershell
.\mvnw.cmd test
```

## Build jar

```powershell
.\mvnw.cmd clean package
```

The generated jar is created under `target/`.
