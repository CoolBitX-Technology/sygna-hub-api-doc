# Sygna Hub Document 

### How to launch Hub service in AWS

![image](hub_on_aws.jpg)

1. Make sure the domain of you service and get the issued cert(s) [ACM](https://docs.aws.amazon.com/acm/index.html) for the domain. 

2. install docker engine and docker-compose
* [Docker](https://docs.docker.com/engine/install/#server)
* [Docker Compose](https://docs.docker.com/compose/install/)

3. download [docker-compose.yml](docker-compose.yml) [docker-compose.aws.override.yml](docker-compose.aws.override.yml) to your `./sygna-hub-api-doc` , and customized `docker-compose.aws.override.yml` to fit your needs. If you changed the folder of files , you have to update settings `docker-compose.aws.override.yml` services:backend:environment:DB_HOST to match the auto generated private dns record ( `postgres.{folder_name}.local`).

4. Create and switch into  AWS context with docker cli (https://docs.docker.com/cloud/ecs-integration/) 

5. execute below command to launch containers in ECS
    ```
    docker-compose  -f docker-compose.yml  -f docker-compose.aws.override.yml up
    ```
6. login into AWS and get the DNS name ( like sygna-hub-XXXXX.ap-northeast-1.elb.amazonaws.com ) of ALB created 

7. Update DNS record to point the frontend / backend location into ALB DNS name in step 6.
