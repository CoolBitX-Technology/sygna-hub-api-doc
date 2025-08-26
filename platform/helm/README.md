# Sygna Hub Helm Chart

This Helm Chart is used to deploy the Sygna Hub frontend (`hub-console`) and backend (`hub-backend`) applications. It is designed to be highly flexible, supporting both local development and production deployments on AWS EKS.

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
   ├── README.md 
   ├── values-local.yaml
   ├── values-aws-env.yaml
   └── values.yaml
```

* `helm/`: The core templates of the chart, which generally do not need modification.
* `values.yaml`: The default values for all configurations.
* `values-local.yaml`: The override file used for **local** deployments.
* `values-aws-env.yaml`: The override file used for **AWS EKS** deployments.

## Main Configuration Parameters

You can adjust the following important parameters in `values.yaml` or your environment-specific override files.

### Resource Configuration

Set CPU and Memory requests and limits for `frontend` and `backend` via the `resources` block. It is a good practice to set `requests` and `limits` to the same value for predictable performance.

**Example** (`values.yaml`):
```yaml
backend:
  resources:
    requests:
      cpu: 256m    # 256 millicores (0.256 CPU Core)
      memory: 512Mi  # 512 Mebibytes
    limits:
      cpu: 256m
      memory: 512Mi
```

### Backend Configuration Source

The `backend.config.source` key in `values.yaml` controls how the backend application is configured.
* `configmap` (Recommended for Local): Reads configuration from a manually created Kubernetes ConfigMap.
* `file` (Alternative for Local): Reads configuration by mounting a file from the host machine (`hostPath`). This is prone to file-sharing issues.
* `environment` (Recommended for AWS): Injects configuration as environment variables from AWS Parameter Store via the Secrets Store CSI Driver.

---

## Scenario 1: Local Development Deployment

This mode uses a Kubernetes `ConfigMap` for configuration and deploys a separate PostgreSQL database as a dependency.

### Step 1: Deploy PostgreSQL Database

We use the independent Bitnami Helm chart to deploy the database.

1.  **Add Bitnami Repository (if you haven't already)**:
    ```bash
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update
    ```

2.  **Prepare PostgreSQL Configuration**:
    Create a `postgres-values.yaml` file in your project's root directory (one level above `helm/`).
    ```yaml
    # postgres-values.yaml
    auth:
      username: "admin"
      password: "p@ssWord0"
      database: "db"
    primary:
      persistence:
        enabled: false
    ```

3.  **Deploy PostgreSQL**:
    ```bash
    helm install postgres-db bitnami/postgresql -f postgres-values.yaml --namespace default
    ```
    This creates a Kubernetes Service named `postgres-db-postgresql`.

### Step 2: Configure & Deploy the Application (ConfigMap Method)

This is the **recommended standard practice** for local development as it avoids host file-sharing issues.

1.  **Update your local `config.yml`**:
    Ensure the `database.host` in your local `config.yml` points to the Kubernetes service: `postgres-db-postgresql`.

2.  **Update `values-local.yaml`**:
    Make sure your `values-local.yaml` is set to use the `configmap` mode.
    ```yaml
    # ../values-local.yaml
    backend:
      config:
        source: configmap
        configmap:
          name: "sygna-hub-backend-config"
    # ... other settings
    ```

3.  **Create the ConfigMap in Kubernetes**:
    This command reads your local file and creates a `ConfigMap` object in the cluster. Run this from the directory containing your `config.yml`:
    ```bash
    # If it already exists, you can delete it first: kubectl delete configmap sygna-hub-backend-config
    kubectl create configmap sygna-hub-backend-config --from-file=config.yml
    ```

4.  **Deploy the Sygna Hub Application**:
    Run the deployment command from your **project root directory**:
    ```bash
    minikube image load sygna/sygna-hub-console:latest-beta
    minikube image load sygna/sygna-hub:latest
    helm upgrade --install sygna-local ./helm -f  ./helm/values-local.yaml
    ```

### Step 3: Access the Application

After a successful deployment, use `port-forward` to access the frontend.

1.  Open a new terminal window and run:
    ```bash
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm install ingress-nginx ingress-nginx/ingress-nginx
    kubectl apply -f ./helm/local-ingress.yaml  

    kubectl port-forward svc/ingress-nginx-controller 8000:80
    ```

2.  Open your web browser and navigate to `http://localhost:8000`.

---

## Scenario 2: AWS EKS Production Deployment

This mode follows cloud-native best practices. Configuration is sourced from **AWS Parameter Store**, and logs are streamed to **CloudWatch**.

**Logging Strategy**: This configuration assumes application logs are written to standard output (`stdout`/`stderr`) and collected by a cluster-wide agent like **Fluent Bit** for forwarding to AWS CloudWatch. Therefore, the persistent volume for logs (`backend.persistence.logs`) is disabled by default for this environment.

### Step 1: Prepare AWS Cloud Resources

Before deploying, ensure you have the following ready:

* An active EKS cluster with the OIDC provider enabled.
* The **Secrets Store CSI Driver** and its **AWS Provider** installed in your cluster.
* A running **Amazon RDS for PostgreSQL** instance.
* An **IAM Role for Service Account (IRSA)** with permissions to read from AWS Parameter Store.
* All necessary parameters populated in **AWS Parameter Store** (e.g., `/sygna/prod/DB_HOST`, `/sygna/prod/DB_PASSWORD`, etc.).

#### Install AWS Load Balancer Controller

The AWS Load Balancer Controller is required for creating and managing ALBs via Kubernetes Ingress. Follow these steps to install it using Helm (recommended for EKS).

1. **Create IAM OIDC Provider (if not already done)**:
   If your cluster doesn't have an IAM OIDC provider, create one:
   ```bash
   eksctl utils associate-iam-oidc-provider --region <region-code> --cluster <your-cluster-name> --approve
   ```

2. **Download and Create IAM Policy**:
   Download the IAM policy JSON for the controller:
   ```bash
   curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.8.2/docs/install/iam_policy.json
   ```
   Create the policy:
   ```bash
   aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam-policy.json
   ```
   Note the returned policy ARN (e.g., `arn:aws:iam::<AWS_ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy`).

3. **Create IAM Role and Service Account using IRSA**:
   Use `eksctl` to create a Kubernetes ServiceAccount and attach the IAM policy:
   ```bash
   eksctl create iamserviceaccount --cluster=<your-cluster-name> --namespace=kube-system --name=aws-load-balancer-controller --attach-policy-arn=arn:aws:iam::<AWS_ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts --region <region-code> --approve
   ```

4. **Add Helm Repository**:
   ```bash
   helm repo add eks https://aws.github.io/eks-charts
   helm repo update
   ```

5. **Install the Controller via Helm**:
   ```bash
   helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=<your-cluster-name> --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller
   ```

6. **Verify Installation**:
   Check the pods in the `kube-system` namespace:
   ```bash
   kubectl get pods -n kube-system | grep aws-load-balancer-controller
   ```
   View logs for any issues:
   ```bash
   kubectl logs -n kube-system deployment/aws-load-balancer-controller
   ```

**Notes**:
- This uses the latest stable version (v2.8.2 as of August 2025); check the [official GitHub repo](https://github.com/kubernetes-sigs/aws-load-balancer-controller) for updates.
- If using Fargate, additional subnet tagging may be required for load balancer discovery.
- For webhook support, install cert-manager if not already present:
  ```bash
  kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.12.3/cert-manager.yaml
  ```
- If you encounter permission issues, ensure the IAM role has the necessary trust relationship with the OIDC provider.

### Step 2: Configure the Application

Edit the `values-aws-env.yaml` file in your project root with your production environment details. The most important fields to update are marked below.

```yaml
# ../values-aws-env.yaml
frontend:
  ingress:
    enabled: true
    className: alb
    annotations:
      # ...
      # !!! Change to your frontend public domain arn !!!
      alb.ingress.kubernetes.io/certificate-arn: 
    hosts:
      # !!! Change to your frontend's public domain name !!!
      - host: your-frontend.your-domain.com
        # ...
backend:
  ingress:
    enabled: true
    className: alb
    annotations:
      # ...
      # !!! Change to your backend public domain arn !!!
      alb.ingress.kubernetes.io/certificate-arn: 
    hosts:
      - host: your-backend.your-domain.com # Change to your domain
        paths:
          - path: /v1
            pathType: Prefix
  
  env:
    # !!! Change to your backend's public API URL !!!
    BACKEND_API_URL: "https://your-backend.your-domain.com/v1"

backend:
  persistence:
    logs:
      enabled: false
  config:
    source: environment
    environment:
      # !!! Set your AWS Parameter Store base path !!!
      parameterStoreBasePath: "/sygna/prod"
      # Add a version string to trigger updates
      configVersion: "v1.0.0"

serviceAccount:
  create: true
  annotations:
    # !!! Change to the ARN of the IAM Role you created for IRSA !!!
    eks.amazonaws.com/role-arn: "arn:aws:iam::123456789012:role/Your-EKS-ParamStore-Reader-Role"
```

### Step 3: Deploy the Sygna Hub Application

1.  **(If first time) Create the Namespace**:
    ```bash
    kubectl create namespace sygna-hub
    ```

2.  **Run the deployment command** from your project root:
    ```bash
    helm upgrade --install sygna-prod ./helm -f ./helm/values-aws-env.yaml --namespace sygna-hub
    ```

### Step 4: Access the Application

Find the public URL by inspecting the Ingress resource:

```bash
kubectl get ingress --namespace sygna-hub
```
The `ADDRESS` column will show the DNS name of the AWS Application Load Balancer. Point your domain's CNAME record to this address.

---

## Operations & Management

### Updating the Application

* **If you changed a Helm template file (`templates/*.yaml`)**:
    * Simply re-run the `helm upgrade` command for your environment.

* **If you changed the local `config.yml` file**:
    1.  Re-create the ConfigMap to sync the changes into the cluster:
        ```bash
        kubectl delete configmap sygna-hub-backend-config --ignore-not-found=true
        kubectl create configmap sygna-hub-backend-config --from-file=config.yml
        ```
    2.  Restart the deployment to make the pod load the new ConfigMap:
        ```bash
        kubectl rollout restart deployment sygna-local-sygna-hub-hub-backend
        ```

* **If you changed a value in AWS Parameter Store**:
    1.  Update the `configVersion` in your `values-aws-env.yaml` file (e.g., to a new timestamp or version number).
    2.  Re-run the `helm upgrade` command for the AWS environment. Helm will detect the change in the annotation and trigger a safe rolling restart.

### Other Common Commands

* **Check Pod Status**:
    ```bash
    # Replace <namespace> with 'default' or 'sygna-hub'
    kubectl get pods --namespace <namespace>
    ```

* **View Real-time Logs (for live debugging)**:
    ```bash
    # Replace <pod-name> and <namespace> with your actual values
    kubectl logs -f <pod-name> --namespace <namespace>
    ```

* **Uninstall / Clean Up a Deployment**:
    ```bash
    # Replace <release-name> and <namespace> with your actual values
    helm uninstall <release-name> --namespace <namespace>
    ```