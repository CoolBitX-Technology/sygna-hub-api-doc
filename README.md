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
2. fill identifier and secret from google into `config.yml` in backend service 

### API document
* [file](swagger.yaml)
* [website](https://coolbitx-technology.github.io/sygna-hub-api-doc/)

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
SEND_PERMISSION_REQUEST_ERROR    | It raised unexpected error when you was sending permission_request to beneficiary VASP, please refer error message |
SEND_PERMISSION_ERROR  | It raised unexpected error when you was sending permission to originator VASP, please refer error message |
SEND_TRANSACTION_ID_ERROR  | It raised unexpected error when you was sending transaction hash to beneficiary VASP, please refer error message |