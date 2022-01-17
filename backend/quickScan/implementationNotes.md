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
ALTER ROLE me CREATEDB;
\du 

# lists all roles/users

\q 

# quit so that we can connect back with the role we created

psql -d postgres -U me
CREATE DATABASE quickScan
\c quickScan 

# connect to the new quickScan database 
CREATE TABLE collection (
    collection_id SERIAL PRIMARY KEY,
    user_id numeric NOT NULL DEFAULT 0,
    video_blob_storage VARCHAR(30),
    3d_object_blob_storage VARCHAR(30)
);

CREATE TABLE image (
    image_id SERIAL PRIMARY KEY,
    image_blob_storage VARCHAR(30)
);

CREATE TABLE collection_image (
    collection_id int REFERENCES collection (collection_id) ON UPDATE CASCADE ON DELETE CASCADE,
    image_id int REFERENCES image (image_id) ON UPDATE CASCADE,
    CONSTRAINT collection_image_pkey PRIMARY KEY (collectiion_id, image_id)
);
```

In regards to the table the collection -> many images relationship is usually implemented by a separate table - `collection_image` in this case. 

https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/

https://stackoverflow.com/questions/9789736/how-to-implement-a-many-to-many-relationship-in-postgresql



