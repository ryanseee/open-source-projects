import os
import json
import boto3
from time import gmtime, strftime

region=os.environ['REGION']
boto_session = boto3.Session(region_name=region)
sagemaker_client = boto_session.client("sagemaker")
runtime_client = boto_session.client("sagemaker-runtime")

role = os.environ['SM_EXECUTION_ROLE']
model_version = os.environ['MODEL_VERSION']
model_package_group_name = os.environ['MODEL_PACKAGE_GROUP_NAME']

def lambda_handler(event, context):
    model_version = event["model_version"]
    model_package_arn = ""
    
    # Get model package and check if expected version exists
    listModePackagesResponse = sagemaker_client.list_model_packages(ModelPackageGroupName=model_package_group_name)
    for model in listModePackagesResponse["ModelPackageSummaryList"]:
        if model["ModelPackageVersion"] == model_version:
            model_package_arn = model["ModelPackageArn"]
            break
    
    if model_package_arn == "":
        raise Exception("model version does not exist")
    
    # Specify a name for the model
    model_name = "backtest-model-" + str(model_version)
    
    # Specify a Model Registry model version
    container_list = [
        {
            "ModelPackageName": model_package_arn
         }
     ]
    
    # Create the model
    sagemaker_client.create_model(
        ModelName = model_name,
        ExecutionRoleArn = role,
        Containers = container_list
    )
    
    endpointConfigName = 'EndpointConfig-Backtest-' + strftime("%Y-%m-%d-%H-%M-%S", gmtime())

    sagemaker_client.create_endpoint_config(
       EndpointConfigName=endpointConfigName,
       ProductionVariants=[
            {
                "ModelName": model_name,
                "VariantName": "AllTraffic",
                "ServerlessConfig": {
                    "MemorySizeInMB": 2048,
                    "MaxConcurrency": 20,
                    "ProvisionedConcurrency": 10,
                }
            } 
        ]
    )
    
    endpoint_name =  "backtest-endpoint-" + str(model_version)
    sagemaker_client.create_endpoint(
        EndpointName=endpoint_name,
        EndpointConfigName=endpointConfigName
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
