const request = require("supertest");
const {app} = require("../server");
const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

//test cases use through the file output
console.log('mongo wrong uri', process.env.MONGO_URI)

describe("Auth API", () => {
  // Clean up test database before running tests
  beforeAll(async () => {
    // Ensure database is connected before running tests
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Ensure Jest exits properly
  });
  //resgister new user test

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });
  //existing email check 
  it("should not register user with existing email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Duplicate User",
      email: "test@example.com", // Same email as before
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("User already exists");
  });
   //invalid email 
  it("should not register with invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Invalid Email",
      email: "invalid-email",
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Invalid email format");
  });

//   //if user going to login should be login with existing mail
//   it("should login an existing user", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       email: "test@example.com",
//       password: "password123",
//     });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("token");
//   });
//    // if password does not match
//   it("should not login with incorrect password", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       email: "test@example.com",
//       password: "wrongpassword",
//     });

//     expect(res.statusCode).toEqual(401);
//     expect(res.body.message).toEqual("Invalid credentials");
//   });
//  // email not found check
//   it("should not login with non-existent email", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       email: "notfound@example.com",
//       password: "password123",
//     });

//     expect(res.statusCode).toEqual(404);
//     expect(res.body.message).toEqual("User not found");
//   });
});

