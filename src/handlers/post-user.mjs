import {
    SecretsManagerClient,
    GetSecretValueCommand,
  } from "@aws-sdk/client-secrets-manager";
  import pkg from 'pg';
  const {Pool} = pkg;
  //need to fix env fetching
  //  const host = process.env.DB_ENDPOINT_ADDRESS || '';
  //  const database = process.env.DB_NAME || '';
  //   const secret_name = process.env.secret_name || '';  
  //   const region= process.env.region || '';  
  
  const client = new SecretsManagerClient({
    region:"us-east-1",
  });
  
  let response;
  
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: "rds!db-e7d46044-ec53-46d0-b2e1-cd26b6ff64de",
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
  
  const secret = response.SecretString;

  
      
    
  const { username } = JSON.parse(secret);
  const { password } = JSON.parse(secret);


export const postUserHandler = async (event) => {
    // if (event.httpMethod !== 'POST') {
    //     throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    // }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const name = body.name;
    const jira_id = body.jira_id;

        try {
          const pool = new Pool({
      user: 'postgres',
        host:'database-1.ckdkfpkoznxf.us-east-1.rds.amazonaws.com',
        // database:'public' , 
        password,
        port: 5432
         });
    
    
    const results = await pool.query("INSERT INTO users VALUES ( nextval('id_sequence'),$1 ,$2);",[name,jira_id]);
    
 } catch (error) {
          console.log(error);
          return {
            statusCode: 500,
            body: JSON.stringify(error),
          };
        }
     
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*", // Allow from anywhere 
          "Access-Control-Allow-Methods": "POST,OPTIONS" // Allow only POST request 
      },
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
     
};
