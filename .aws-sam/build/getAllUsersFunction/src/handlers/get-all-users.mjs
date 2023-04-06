import {
    SecretsManagerClient,
    GetSecretValueCommand,
  } from "@aws-sdk/client-secrets-manager";
  import pkg from 'pg';
  const {Pool} = pkg;
  //  const host = process.env.DB_ENDPOINT_ADDRESS || '';

  //   const database = process.env.DB_NAME || '';
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

export const getAllUsersHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    
    try {
        const pool = new Pool({
      user: 'postgres',
        host:'database-1.ckdkfpkoznxf.us-east-1.rds.amazonaws.com',
        // database:'public' , 
        password,
        port: 5432,
       })

      global.results = await pool.query('SELECT * from "users"');
      
        }
       catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        console.log(error);
        throw error; };
  
  
  // const results = await pool.query('SELECT * from "users" where jira_id  LIKE '%' || $1 || '%'', [userId]);
  console.info('user:', results.rows);
    
  const response = {
    statusCode: 200, headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*", // Allow from anywhere 
      "Access-Control-Allow-Methods": "GET" // Allow only GET request 
  },
    body: JSON.stringify(results.rows)
   
};
console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
 return response;
}

