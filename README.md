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
Event         | Description  
--------------|:-----:|
RECEIVE_HIGH_RISK_TRANSACTION    | Please accept or reject this transaction from originator VASP by `PATCH /permission` |
RECEIVE_APPROVED_TRANSACTION    | Your transaction was approved by beneficiary VASP, please transfer transaction hash to beneficiary VASP by `PATCH /txid` |
RECEIVE_REJECTED_TRANSACTION  | Your transaction was rejected by beneficiary VASP, please refer reject message or contact with beneficiary VASP |
RECEIVE_TRANSACTION_HASH    | You got transaction hash from originator VASP |
HANDLE_COMING_ADDRESS_VALIDATION_ERROR    | It raised unexpected error when originator VASP validated if specific addresses were belong to you, please refer error message |
HANDLE_COMING_PERMISSION_REQUEST_ERROR  | It raised unexpected error when your endpoint got permission_request from originator VASP, please refer error message |
HANDLE_COMING_PERMISSION_ERROR    | It raised unexpected error when your endpoint got permission request from beneficiary VASP, please refer error message |
HANDLE_COMING_TXID_ERROR    | It raised unexpected error when your endpoint got transaction hash from originator VASP, please refer error message |
HANDLE_EMAIL_PROTOCOL_PERMISSION_ERROR  | It raised unexpected error when beneficiary VASP which got your permission_request by email protocol was sending permission to you, please refer error message |
HANDLE_EMAIL_PROTOCOL_TXID_ERROR    | It raised unexpected error when you was sending transaction hash to beneficiary VASP which was transferred with you by email protocol, please refer error message |
HANDLE_EMAIL_PROTOCOL_PERMISSION_REQUEST_ERROR    | It raised unexpected error when you was sending permission request to beneficiary VASP which was transferred with you by email protocol, please refer error message |
SEND_PERMISSION_REQUEST_ERROR    | It raised unexpected error when you was sending permission_request to beneficiary VASP, please refer error message |
SEND_PERMISSION_ERROR  | It raised unexpected error when you was sending permission to originator VASP, please refer error message |
SEND_TRANSACTION_ID_ERROR  | It raised unexpected error when you was sending transaction hash to beneficiary VASP, please refer error message |
SEND_EMAIL_PROTOCOL_DEPOSIT_ERROR  | It raised unexpected error when you was asking originator VASP to fill customer information, please refer error message |
SEND_EMAIL_PROTOCOL_PERMISSION_ERROR  | It raised unexpected error when you was send permission to originator VASP, please refer error message |