# Starting the Server

1. First log into ec2 aws console and go to security groups on the sidebar. 
2. Once in security groups click on the one called `sg-0485e27b1a3ba30b4 - WebTier`
3. Click on edit inbound rules and for the rule which has `port range: 22`, `type: ssh` - modify the source to be `MY IP` and then click save rule
4. execute the following command in terminal in the same directory which has the file `ec2keypair.pem` - this file can be downloaded from QuickSacn/backend directory in github

```ssh -i "ec2keypair.pem" ec2-user@ec2-3-98-130-154.ca-central-1.compute.amazonaws.com```

5. Now you are in, to start the server perform `cd QuickScanServer` then `DEBUG=server:* nodemon start`

# Adding Firebase Auth to custom backend

The authentication system will work as follows - we will use Firebase Auth to login a user to the front end (React), get a AuthToken for that user, then send that token to our server and use Firebase Admin to verify that token (backend). So both the frontend and the backend need to be using Firebase. 

https://itnext.io/how-to-use-firebase-auth-with-a-custom-node-backend-99a106376c8a


# Adding PostgreSQL integration to custom backend

For testing we will create a local postgresql instance - we can host an instance on aws rds when we work on deploying the project. 

`brew services start postgresql`

The above command starts the postgres service, next step is to connect to it  using the postgres command line.

To connect to the default postgres database use 

`psql postgres`

Setting up local PostgreSQL - 

```
psql postgres
\conninfo 

# used to find the port to connect to the datbase (modify the port in queries.js)

CREATE ROLE admin WITH LOGIN PASSWORD 'password';
ALTER ROLE admin CREATEDB;
\du 

# lists all roles/users

\q 

# quit so that we can connect back with the role we created

psql -d postgres -U admin 
CREATE DATABASE quickScan
\c quickScan 

# connect to the new quickScan database 
CREATE TABLE collection (
    collection_id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    user_id numeric NOT NULL DEFAULT 0,
    video_blob_storage VARCHAR(30),
    three_dimen_object_blob_storage VARCHAR(30),
    timestamp timestamp default current_timestamp
);

CREATE TABLE image (
    image_id SERIAL PRIMARY KEY,
    image_blob_storage VARCHAR(30)
);

CREATE TABLE tag (
    tag_id SERIAL PRIMARY KEY,
    tag_title VARCHAR(30)
);

CREATE TABLE collection_image (
    collection_id int REFERENCES collection (collection_id) ON UPDATE CASCADE ON DELETE CASCADE,
    image_id int REFERENCES image (image_id) ON UPDATE CASCADE,
    CONSTRAINT collection_image_pkey PRIMARY KEY (collection_id, image_id)
);

CREATE TABLE collection_tag (
    collection_id int REFERENCES collection (collection_id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id int REFERENCES tag (tag_id) ON UPDATE CASCADE,
    CONSTRAINT collection_tag_pkey PRIMARY KEY (collection_id, tag_id)
);
```

In regards to the table the collection -> many images relationship is usually implemented by a separate table - `collection_image` in this case. 

This intermediary table can help with overcoming the many-to-many obstacle - it might be that the web
app is very very popular and needs de-normalizing down the road, but it is pointless muddying the 
waters too early.

https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/

https://stackoverflow.com/questions/9789736/how-to-implement-a-many-to-many-relationship-in-postgresql


## Implementation of createCollection 

The general idea is once the user hits the endpoint for creating a Collection with the required user_id and name: 

1. Generate a presigned URL and store the s3 location 





# starting commands
```
backend - DEBUG=server:* nodemon start
frontend - npm run serve
```
