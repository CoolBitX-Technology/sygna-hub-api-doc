# Sygna Hub Document
### How to launch Hub service in local
1. install docker engine and docker-compose
* [Docker](https://docs.docker.com/engine/install/#server)
* [Docker Compose](https://docs.docker.com/compose/install/)

2. download [docker-compose](docker-compose.yml) to your desired location, and customized to fit your needs

3. download [example config file](config.example.yml) and rename it to `config.yml`, fill your credentials, and customized to fit your needs, notice that you can only use `localhost` as host name without https for local test and the functionality is limited in local mode.

4. execute below command to launch containers
    ```
    docker-compose up -f docker-compose.yml  -f docker-compose.local.override.yml
    ```

### How to launch Hub service in AWS

1. Make sure the domain of you service and get the issued cert(s) [ACM](https://docs.aws.amazon.com/acm/index.html) for the domain. 

2. install docker engine and docker-compose
* [Docker](https://docs.docker.com/engine/install/#server)
* [Docker Compose](https://docs.docker.com/compose/install/)

3. download [docker-compose](docker-compose.yml) [docker-compose.aws.override.yml](docker-compose.aws.override.yml) to your `./sygna-hub-api-doc` , and customized `docker-compose.aws.override.yml` to fit your needs. If you changed the folder of files , you have to update DB_HOST in backend environment to match the auto generated private dns record.

4. Create and switch into  AWS context in docker (https://docs.docker.com/cloud/ecs-integration/) 

5. execute below command to launch containers
    ```
    docker-compose  -f docker-compose.yml  -f docker-compose.aws.override.yml up
    ```
6. login into AWS and get the DNS name ( like sygna-hub-XXXXX.ap-northeast-1.elb.amazonaws.com ) of ALB created 

7. Update DNS record to point the frontend / backend location into ALB DNS name in step 6.

### Database tunning
#### If you encounter database performance issue, you can try following procedure:
1. find your `postgresql.conf`, it's usually located in `/var/lib/postgresql/data/postgresql.conf`
2. change following values in `postgresql.conf`
    ```
    max_connections = 300
    shared_buffers = 512MB
    ```
    notice that higher value require better hardware
3. restart database to apply new configuration

### How to enable google login
1. please refer [document](https://developers.google.com/identity/sign-in/web/sign-in) and register your frontend domain in google.
2. fill identifier and secret from google into `config.yml` in backend service 

### API document
* [file](swagger.yaml)
* [website](https://coolbitx-technology.github.io/sygna-hub-api-doc/)

### Shyft relay node setup
If you wish to enable travel rule protocol `Veriscope on Shyft`, follow instructions below to setup your relay node.
1. Head to [chain spec](https://github.com/ShyftNetwork/veriscope/tree/main/chains) in Veriscope github repository, or you can clone entire repository.
2. Choose your target chain name and enter that folder
    * for example, if you're using beta builds of the Sygna Hub, you should select `veriscope_testnet`
    * if you're using production builds (without beta in tag), you should select `fed_mainnet`
3. Download `shyftchainspec.json` and `static-nodes.json` to this folder
    * make sure `shyft-relay.cfg` is also in same directory, it's in the repository
4. You can now try to start shyft relay node via docker compose
    * Please be notified that syncing blockchain takes time, for example, syncing veriscope_testnet takes about 15 mins, and syncing fed_mainnet can take up to 2 hours
    * Please make sure your database mount point (`/opt/nm/db`) has at least 4GB free space

### Webhook events
If you registered webhook_url in `config.yml`, you would receive payload which schema as below:
```
{
    "data_id": [
      "16adba2e-1f03-40d2-95d6-93069c9607be"
    ],
    "event": "RECEIVE_TRANSACTION_HASH",
    "payload": {},
    "request_id": "16adba2e-1f03-40d2-95d6-93069c9607be",
    "time": "2021-11-05T06:09:10.062Z"
  }
```
* `data_id` : unique identifiers in target table and the format are ***uuid***
* `event` : please refer below table to process desired actions
* `payload` : data payload depends on event
* `request_id` : unique identifier for request and the format is ***uuid***
* `time` : when the event was sent at and the format is ***YYYY-MM-DDTHH:MI:SS.SSSZ***

#### all available events
Event         | Description  |  Recipient (Who will receive this webhook) | Counterparty VASP be notified? | Error code |
--------------|:-----:|:-----:|:-----:|:----------:|
RECEIVE_HIGH_RISK_TRANSACTION | The data transfer is high risk. Please accept or reject this data transfer from originator VASP by hitting `PATCH /permission` | Beneficiary VASP | No | no error code is applicable |
RECEIVE_REJECTED_TRANSACTION | Your data transfer was rejected by beneficiary VASP, please refer to the reject message or contact the beneficiary VASP | Originator VASP | No | no error code is applicable |
RECEIVE_TRANSACTION_HASH | You've received transaction hash from originator VASP | Beneficiary VASP | No | no error code is applicable |
SEND_PERMISSION_REQUEST_ERROR | There is an unexpected error(s) when you send permission_request to the beneficiary VASP. Please refer to the error message. | Originator VASP | No | 06000 06002 06003 06004 06005 06006 06007 06008 | 
SEND_PERMISSION_ERROR | There is an unexpected error(s) when you send permission to the originator VASP. Please refer to the error message. | Beneficiary VASP | No | 99999 | 
SEND_TRANSACTION_ID_ERROR | There is an unexpected error(s) when you send transaction hash to the beneficiary VASP Please refer to the error message. | Originator VASP | No | 99999
HANDLE_COMING_ADDRESS_VALIDATION_ERROR | There is an unexpected error(s) when the originator VASP validated whether the beneficiary wallet address belongs to you. Please refer to the error message. | Beneficiary VASP | Yes, Originator VASP receives: `SEND_PERMISSION_REQUEST_ERROR` | 99999
HANDLE_COMING_PERMISSION_REQUEST_ERROR | There is an unexpected error(s) when your endpoint receives the permission_request from the originator VASP. Please refer to the error message. | Beneficiary VASP | No | 06002 06003 06004 06005 06006 06007 06008 99999 | 
HANDLE_COMING_PERMISSION_ERROR | There is an unexpected error(s) when your endpoint receives the permission from the beneficiary VASP. Please refer error message | Originator VASP | No | 99999
HANDLE_COMING_TXID_ERROR | There is an unexpected error when your endpoint receives the transaction hash from the originator VASP. Please refer to the error message. | Beneficiary VASP | No | 99999
HANDLE_EMAIL_PROTOCOL_PERMISSION_ERROR | There is an unexpected error(s) when the beneficiary VASP was sending permission to you via the email protocol. Please refer to the error message. | Originator VASP | No | 02000 02001 99999
HANDLE_EMAIL_PROTOCOL_TXID_ERROR | There is an unexpected error(s) when you send the transaction hash to the beneficiary VASP via the email protocol. Please refer to the error message. | Originator VASP | No | 01002 99999
HANDLE_EMAIL_PROTOCOL_PERMISSION_REQUEST_ERROR | There is an unexpected error(s) when you send permission_request to the beneficiary VASP via the email protocol. Please refer to the error message. | Originator VASP | No | 02000 02001 99999
SEND_EMAIL_PROTOCOL_DEPOSIT_ERROR | There is an unexpected error(s) when you requested the originator VASP to provide the originator customer information via the email protocol. Please refer to the error message. | Beneficiary VASP | No | 02000 02001 02002 02003 02009 99999
SEND_EMAIL_PROTOCOL_PERMISSION_ERROR | There is an unexpected error(s) when you send permission to the originator VASP via email protocol. Please refer to the error message. | Beneficiary VASP | No | 02001 99999
RECEIVE_APPROVED_TRANSACTION_LOW_RISK | Your data transfer was approved by beneficiary VASP and the Beneficiary risk is low, please transfer transaction hash to beneficiary VASP by PATCH /txid | Originator VASP | No | no error code is applicable |
RECEIVE_APPROVED_TRANSACTION_HIGH_RISK | Your data transfer was approved by beneficiary VASP and the Beneficiary risk is high, please transfer transaction hash to beneficiary VASP by PATCH /txid | Originator VASP | No | no error code is applicable |
RECEIVE_DATA_TRANSFER_TRANSACTION | Receiving a data transfer when Originator VASP send the data transfer and Beneficiary VASP turned off auto-accept setting. Please accept or reject this data transfer by hitting PATCH /permission | Beneficiary VASP | No | no error code is applicable |
SEND_COUNTERPARTY_SERVER_NOT_HEALTHY_ERROR | The Counterparty server is not healthy | Both VASP | No | no error code is applicable |