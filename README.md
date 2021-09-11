# sygna-bundle-api-doc
### how to launch Hub service
1. install docker and docker-compose
* [Docker](https://docs.docker.com/engine/install/ubuntu/)
* [Docker Compose](https://docs.docker.com/compose/install/)

2. download below docker-compose.yaml and replace services and environment variables depends on your case
```
version: "2.1"

services:
  # (Optional)It's not required if you already have a postgres database which version is 12
  postgres:
    image: postgres:12-alpine
    ports:
      - 5432:5432
    environment:
      - POSTGRES_PASSWORD=12345
      - POSTGRES_USER=admin
      - POSTGRES_DB=db
    volumes:
      - "./localstack-data/sqldata:/var/lib/postgresql/data"
  # (Optional)adminer is GUI for Database management
  adminer:
    image: adminer
    restart: always
    ports:
      - 55008:8080
    environment:
      - ADMINER_DEFAULT_SERVER=postgres
  # (Optional)It's not required if you only want to use Restful API
  frontend:
    image: sygna-hub-frontend
    ports:
      - 8000:80
    environment:
      # replace with your backend url
      - BACKEND_API_URL=http://localhost:8080/v1
  backend:
    image: sygna-hub-backend:latest
    ports:
      - 8080:8080
    depends_on: 
      - postgres 
    environment:
      # DB_ must be match your config for postgres
      - DB_USER=admin
      - DB_PASSWORD=12345
      - DB_HOST=postgres
      - DB_PORT=5432
      # Filename is the file to write logs to.  Backup log files will be retained
      # in the same directory.  It uses <processname>-lumberjack.log in
      # os.TempDir() if empty.
      - LOG_FILE_NAME=temp
      # LOG_MAX_SIZE is the maximum size in megabytes of the log file before it gets rotated. 
      # It defaults to 100 megabytes.
      - LOG_MAX_SIZE=100
      # LOG_MAX_BACKUPS is the maximum number of old log files to retain.  The default
      # is to retain all old log files (though MaxAge may still cause them to get
      # deleted.)
      - LOG_MAX_BACKUPS=1
      # LOG_MAX_AGE is the maximum number of days to retain old log files based on the
      # timestamp encoded in their filename.  Note that a day is defined as 24
      # hours and may not exactly correspond to calendar days due to daylight
      # savings, leap seconds, etc. The default is not to remove old log files
      # based on age.
      - LOG_MAX_AGE=1
      - ACCESS_TOKEN_EXPIRES_IN_SECONDS=604800
      # receive permission from beneficiary after transfer sent
      - CALLBACK_HOST=https://{{your_domain}}/v1/callbacks/permission
      - ENABLE_CORS=true
      - ALLOW_ORIGINS=http://localhost:8000
      # required only if you want to enable Google login
      - GOOGLE_SSO_ID=
      - GOOGLE_SSO_SECRET=
    volumes:
      # replace your path to save log
      - "./log:/var/log"
```
3. execute below command to launch containers
```
docker-compose up
```

### how to enable google login
1. please refer [document](https://developers.google.com/identity/sign-in/web/sign-in) and register your frontend domain in google.
2. replace identifier and secret from google into GOOGLE_SSO_ID and GOOGLE_SSO_SECRET in backend service 