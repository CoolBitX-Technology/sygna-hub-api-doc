# Sygna Hub Document
### How to launch Hub service
1. install docker engine and docker-compose
* [Docker](https://docs.docker.com/engine/install/ubuntu/)
* [Docker Compose](https://docs.docker.com/compose/install/)

2. download [docker-compose](docker-compose.yml) to your desired location, and customized to fit your needs

3. download [example config file](config.example.yml) and rename it to `config.yml`, fill your credentials, and customized to fit your needs

4. execute below command to launch containers
```
docker-compose up
```
### How to enable google login
1. please refer [document](https://developers.google.com/identity/sign-in/web/sign-in) and register your frontend domain in google.
2. replace identifier and secret from google into GOOGLE_SSO_ID and GOOGLE_SSO_SECRET in backend service 

### API document
* [file](swagger.yaml)
* [website](https://coolbitx-technology.github.io/sygna-hub-api-doc/)
