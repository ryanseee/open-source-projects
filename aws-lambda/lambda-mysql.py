import sys
import logging
import pymysql
import os

# rds settings
user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
rds_host = os.environ['RDS_HOST']
db_name = os.environ['DB_NAME']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# create the database connection outside of the handler to allow connections to be
# re-used by subsequent function invocations.
try:
    conn = pymysql.connect(host=rds_host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

def lambda_handler(event, context):
    UserId = "001" # Example User ID
    MessageId = event['Records'][0]['Sns']['MessageId'] # Based on the structure of what is received from SNS
    
    item_count = 0
    sql_string = f"insert into Messages (UserId, MessageId) values({UserId}, '{MessageId}')"

    with conn.cursor() as cur:
        cur.execute("create table if not exists Messages ( RecordId INT NOT NULL AUTO_INCREMENT, UserId INT, MessageId varchar(255), PRIMARY KEY(RecordId))")
        cur.execute(sql_string)
        conn.commit()
        cur.execute("select * from Messages")
        
        logger.info("The following items have been added to the database:")
        for row in cur:
            item_count += 1
            logger.info(row)
    conn.commit()

    return "Added %d items to RDS MySQL table" %(item_count)
