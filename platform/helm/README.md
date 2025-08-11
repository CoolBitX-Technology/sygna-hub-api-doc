# Sygna Hub Helm Chart

This Helm Chart is used to deploy the Sygna Hub frontend (hub-console) and backend (hub-backend) applications. It is designed to be highly flexible, supporting both local development and production deployments on AWS EKS.

## Prerequisites

Before you begin, please ensure you have the following tools installed and configured:

* `kubectl`: The Kubernetes command-line tool.
* `helm`: The package manager for Kubernetes.
* **For Local**: Docker Desktop (with Kubernetes enabled) or another local Kubernetes environment.
* **For AWS**:
    * `aws-cli`: The AWS Command Line Interface, configured with your credentials.
    * `eksctl`: (Recommended) A command-line tool for creating and managing EKS clusters.

## File Structure

The recommended project structure is as follows. This `README.md` file is located inside the `helm/` directory.

```
.
├── helm/
   ├── templates/
   ├── Chart.yaml
   ├── README.md   <-- (This file)
   └── values.yaml
   ├── values-aws-env.yaml
   └── values-local.yaml
```

* `helm/`: The core templates of the chart, which generally do not need modification.
* `values.yaml`: The default values for all configurations.
* `values-local.yaml`: The override file used for **local** deployments.
* `values-aws-env.yaml`: The override file used for **AWS EKS** deployments.

---

## Scenario 1: Local Development Deployment

This mode uses a standalone local `config.yml` file and deploys a separate PostgreSQL database as a dependency within the local Kubernetes cluster.

### Step 1: Deploy the PostgreSQL Database

We will use the independent Bitnami Helm chart to deploy the database.

1.  **Add the Bitnami Repository (if you haven't already)**:
    ```bash
    helm repo add bitnami [https://charts.bitnami.com/bitnami](https://charts.bitnami.com/bitnami)
    helm repo update
    ```

2.  **Prepare PostgreSQL Configuration**:
    Create a `postgres-values.yaml` file in your project's root directory (one level above `helm/`).
    ```yaml
    # postgres-values.yaml
    auth:
      # Set your username, password, and database name
      # These values should match the DB_* settings in your application's config.yml
      username: "admin"
      password: "p@ssWord0"
      database: "db"
    primary:
      # For local testing, we disable persistence for a clean slate on each deployment.
      # If you wish to retain data, set enabled to true.
      persistence:
        enabled: false
    ```

3.  **Deploy PostgreSQL**:
    ```bash
    helm install postgres-db bitnami/postgresql -f postgres-values.yaml --namespace default
    ```
    This will create a Kubernetes Service named `postgres-db-postgresql` in your cluster.

### Step 2: Configure the Application

1.  **Modify `config.yml`**:
    Ensure the database host in your local `config.yml` file points to the Kubernetes service created in the previous step.
    ```yaml
    # In your config.yml file
    database:
      host: postgres-db-postgresql  # This is the database service name
      # ... other settings like user, password, dbname must match postgres-values.yaml
    ```

2.  **Modify `values-local.yaml`**:
    Open the `values-local.yaml` file located in your project root and **update the `path`** to the **absolute path** of your local `config.yml`.
    ```yaml
    # ../values-local.yaml
    backend:
      config:
        source: file
        file:
          # !!! Change this to the correct absolute path on your machine !!!
          path: /Users/yourname/projects/sygna-project/config.yml
    ```

### Step 3: Deploy the Sygna Hub Application

Run the following command from your **project root directory** (the parent directory of `helm/`).

```bash
# Note the path to the values file is ../values-local.yaml
helm upgrade --install sygna-local ./helm -f values-local.yaml
```

### Step 4: Access the Application

After a successful deployment, the recommended way to access the frontend is via `port-forward`.

1.  Open a new terminal window and run:
    ```bash
    kubectl port-forward svc/sygna-local-sygna-hub-hub-frontend 8000:80
    ```

2.  Open your web browser and navigate to `http://localhost:8000`.

---

## Scenario 2: AWS EKS Production Deployment

This mode sources its configuration from **AWS Parameter Store**, which are injected as environment variables at runtime. Logs are streamed directly to CloudWatch, and no PVC is used for logging.

### Step 1: Prepare AWS Cloud Resources

Before deploying, ensure you have the following resources ready in your AWS account:

* An active EKS cluster with the OIDC provider enabled.
* The **Secrets Store CSI Driver** and its **AWS Provider** installed in your cluster.
* A running **Amazon RDS for PostgreSQL** instance or another managed database.
* An **IAM Role** for the Service Account (IRSA) with permissions to read from AWS Parameter Store.
* All necessary parameters populated in **AWS Parameter Store** (as required by `values-aws-env.yaml`).
    * For example, create parameters like `/sygna/prod/DB_HOST`, `/sygna/prod/DB_PASSWORD` (as `SecureString`), etc.

### Step 2: Configure the Application

Edit the `values-aws-env.yaml` file in your project root with your production environment details.

```yaml
# ../values-aws-env.yaml
frontend:
  ingress:
    enabled: true
    className: alb
    annotations:
      alb.ingress.kubernetes.io/scheme: internet-facing
      alb.ingress.kubernetes.io/target-type: ip
      # You may need to add your ACM ARN here depending on your setup
      # alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:....
    hosts:
      # !!! Change to your frontend's public domain name !!!
      - host: your-frontend.your-domain.com
        paths:
          - path: /
            pathType: Prefix
  
  env:
    # !!! Change to your backend's public API URL !!!
    BACKEND_API_URL: "[https://your-backend.your-domain.com/v1](https://your-backend.your-domain.com/v1)"

backend:
  persistence:
    logs:
      enabled: false # Ensure log persistence is disabled for the cloud environment
  config:
    source: environment
    environment:
      kubernetesSecretName: "sygna-hub-backend-env-secret"
      # !!! Set the base path used in your AWS Parameter Store !!!
      parameterStoreBasePath: "/sygna/prod"
      # Note: The list of parameters is defined in the main values.yaml.
      # The actual values MUST be created in AWS Parameter Store.

serviceAccount:
  create: true
  # !!! Change to the ARN of the IAM Role you created for IRSA !!!
  annotations:
    [eks.amazonaws.com/role-arn](https://eks.amazonaws.com/role-arn): "arn:aws:iam::123456789012:role/Your-EKS-ParamStore-Reader-Role"
```

### Step 3: Deploy the Sygna Hub Application

1.  **(If first time) Create the Namespace**:
    ```bash
    kubectl create namespace sygna-hub
    ```

2.  **Run the deployment command**:
    Execute this command from your **project root directory**.
    ```bash
    helm upgrade --install sygna-prod ./helm -f values-aws-env.yaml --namespace sygna-hub
    ```

### Step 4: Access the Application

After deployment, find the public URL of the application by inspecting the Ingress resource.

```bash
kubectl get ingress --namespace sygna-hub
```
The `ADDRESS` column will show the DNS name of the AWS Application Load Balancer. You will need to point your domain's CNAME record to this address.

---

## Common Management Commands

Here are some frequently used commands for daily operations.

* **Check Pod Status**:
    ```bash
    # Replace <namespace> with 'default' or 'sygna-hub'
    kubectl get pods --namespace <namespace>
    ```

* **View Real-time Logs**:
    ```bash
    # Replace <pod-name> and <namespace> with your actual values
    kubectl logs -f <pod-name> --namespace <namespace>
    ```

* **Restart an Application After a Config Change**:
    Run this command to safely restart an application after updating its configuration (e.g., in `config.yml` or AWS Parameter Store).
    ```bash
    # Replace <deployment-name> and <namespace> with your actual values
    kubectl rollout restart deployment <deployment-name> --namespace <namespace>
    ```

* **Uninstall / Clean Up a Deployment**:
    ```bash
    # Replace <release-name> and <namespace> with your actual values
    helm uninstall <release-name> --namespace <namespace>
    ```