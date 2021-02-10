#!/usr/bin/env nodejs

"use strict";

// This script initializes the database. You can set the environment variable
// before running it (default: development). ie:
// NODE_ENV=production node artifacts/db-reset.js

const _ = require("underscore");
const { MongoClient } = require("mongodb");
const { db } = require("../config/config");

const USERS_TO_INSERT = [
    {
        "_id": 100,
        "userName": "admin",
        "firstName": "Node Goat",
        "lastName": "Admin",
        "password": "Admin_123",
        //"password" : "$2a$10$8Zo/1e8KM8QzqOKqbDlYlONBOzukWXrM.IiyzqHRYDXqwB3gzDsba", // Admin_123
        "isAdmin": true
    }, {
        "_id": 1,
        "userName": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "benefitStartDate": "2030-01-10",
        "password": "User1_123"
        // "password" : "$2a$10$RNFhiNmt2TTpVO9cqZElb.LQM9e1mzDoggEHufLjAnAKImc6FNE86",// User1_123
    }, {
        "_id": 2,
        "userName": "user2",
        "firstName": "Will",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User2_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 3,
        "userName": "user3",
        "firstName": "Will",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User3_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 4,
        "userName": "user4",
        "firstName": "Student 4",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User4_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 5,
        "userName": "user5",
        "firstName": "Student 5",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User5_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 6,
        "userName": "user6",
        "firstName": "Student 6",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User6_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 7,
        "userName": "user7",
        "firstName": "Student 7",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User7_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 8,
        "userName": "user8",
        "firstName": "Student 8",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User8_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 9,
        "userName": "user9",
        "firstName": "Student 9",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User9_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 10,
        "userName": "user10",
        "firstName": "Student 10",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User10_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 11,
        "userName": "user11",
        "firstName": "Student 11",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User11_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }, {
        "_id": 12,
        "userName": "user12",
        "firstName": "Student 12",
        "lastName": "Smith",
        "benefitStartDate": "2025-11-30",
        "password": "User12_123"
        //"password" : "$2a$10$Tlx2cNv15M0Aia7wyItjsepeA8Y6PyBYaNdQqvpxkIUlcONf1ZHyq", // User2_123
    }
	
	];

// Getting the global config taking in account he environment (proc)

const parseResponse = (err, res, comm) => {
    if (err) {
        console.log("ERROR:");
        console.log(comm);
        console.log(JSON.stringify(err));
        process.exit(1);
    }
    console.log(comm);
    console.log(JSON.stringify(res));
}


// Starting here
MongoClient.connect(db, (err, db) =>  {
    if (err) {
        console.log("ERROR: connect");
        console.log(JSON.stringify(err));
        process.exit(1);
    }
    console.log("Connected to the database: " + db);

    // remove existing data (if any), we don't want to look for errors here
    db.dropCollection("users");
    db.dropCollection("allocations");
    db.dropCollection("contributions");
    db.dropCollection("memos");
    db.dropCollection("counters"); 

    const usersCol = db.collection("users");
    const allocationsCol = db.collection("allocations");
    const countersCol = db.collection("counters");

    // reset unique id counter
    countersCol.insert({
        _id: "userId",
        seq: 3
    });

    // insert admin and test users
    console.log("Users to insert:");
    USERS_TO_INSERT.forEach((user) => console.log(JSON.stringify(user)));

    usersCol.insertMany(USERS_TO_INSERT, (err, data) => {
        const finalAllocations = [];

        // We can't continue if error here
        if (err) {
            console.log("ERROR: insertMany");
            console.log(JSON.stringify(err));
            process.exit(1);
        }
        parseResponse(err, data, "users.insertMany");

        data.ops.forEach((user) => {
            const stocks = Math.floor((Math.random() * 40) + 1);
            const funds = Math.floor((Math.random() * 40) + 1);

            finalAllocations.push({
                userId: user._id,
                stocks: stocks,
                funds: funds,
                bonds: 100 - (stocks + funds)
            });
        });

        console.log("Allocations to insert:");
        finalAllocations.forEach(allocation => console.log(JSON.stringify(allocation)));

        allocationsCol.insertMany(finalAllocations, (err, data) => {
            parseResponse(err, data, "allocations.insertMany");
            console.log("Database reset performed successfully")
            process.exit(0);
        });

    });
});