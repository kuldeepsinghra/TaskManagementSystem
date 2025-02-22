Task Management System

Steps to Set Up and Run the Project

Step 1: Set Up the Project Structure

Ensure that you have the correct project structure in place. Clone the repository or create your own structure based on your needs.

Step 2: Install Required Dependencies

Run the following command to install all necessary dependencies:

npm install

You can find the list of required dependencies in the package.json file.

Step 3: Clone the Repository (Optional)

If you want to use this project directly, you can clone it using:

git clone https://github.com/kuldeepsinghra/TaskManagementSystem.git

Step 4: Create an .env File

Create a .env file in the root of your project and add the following environment variables:

MONGO_URI=<your_mongo_db_connection_string>
PORT=<your_desired_port>
EMAIL_USER=<your_email_user>
EMAIL_PASS=<your_email_password>
JWT_SECRET=<your_jwt_secret>

You can create a MongoDB cluster or collection using MongoDB Atlas if needed.

Step 5: Push Your Code to a Repository

If you modified the project, push your changes to your own GitHub repository:

git add .
git commit -m "Initial commit"
git push origin main

Step 6: Deploy the Service

You can deploy the project using Render or any cloud platform that supports Node.js applications. Make sure to add the necessary environment variables in the deployment settings.

Step 7: Add Secrets and Variables in Render Settings

In the Render settings:

Go to Environment Variables and add all the required .env variables.

Add RENDER_DEPLOY_HOOK (found in Render) to trigger automatic deployments when you push new changes.

Step 8: Start the Server

Run the following command to start the server:

npm start

Step 9: Run Tests (Optional)

To run tests using Jest, use:

npm test

Step 10: API Usage

Once the server is running, you can test the API endpoints using Postman or any API testing tool.



//test cases to run your service via postman
1.for register api
post request
http://localhost:<replace your port>/api/auth/register
data into body {
  "name": "akash kumar",
  "email": "aakash@gmail.com",
  "password": "password123",
  "role": "user"
}

2.for login api
post request
http://localhost:<replace your port>/api/auth/login
data into body 
{
    "email": "aakash@gmail.com",
    "password": "password123"
}

3.for get task data
[post request](http://localhost:<replace your port>/api/tasks)
data into body {
  "title": "Aakash Complete Assignment",
  "description": "Complete the Node.js assignment",
  "status": "Pending",
  "dueDate": "2025-02-20",
  "assignedTo": "67b764226a3fac5f4d5665a2"    (this is the user id which reprensent the memeber of which has task will be given)
}
pass the jwt token into headers or authorization select jwt -> your token(which is you got from login or register as a response)

4.for get task data
[get request](http://localhost:<replace your port>/api/tasks)
pass only token which we make by the user jwt - > your token into headers(this will give particular tasks of that user)

5. for update task data
   [put request]http://localhost:<your port>/api/tasks/:id
pass the value into the body what you want to update and this will update your task

6.similar for delete(admin can only be delete task)
