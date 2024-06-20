import express from "express";
import { app } from "./main";
import { getUsers, addUser, deleteUser, updateUser, findUniqueUser, findUsersByAge, findUserByString } from "./models";

const router = express.Router();

router.get("/users", async(req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error fetching users"});
    }
});

router.get("/users/:id", async(req, res) => {
    try {
        const user = await findUniqueUser(req.params.id);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error fetching user"});
    }
});

router.post("/users", async(req, res) => {
    try {
        await addUser(req.body.name, req.body.age);
        res.status(201).json({message: "User created"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error creating user"});
    }
});

router.get("/users/age/:age/:operator", async(req, res) => {
    try {
        const operator = req.params.operator === '<' ? '<' : req.params.operator === '>' ? '>' : '=';
        const users = await findUsersByAge(parseInt(req.params.age), operator);
        res.json(users);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error fetching users by age"});
    }
});

router.get("/users/name/:name/:operator", async(req, res) => {
    try {
        const operator = req.params.operator === 'contains' ? 'contains' : req.params.operator === 'does not contain' ? 'does not contain' : 'contains';
        const users = await findUserByString(req.params.name, operator);
        res.json(users);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error fetching users by string"});
    }
})

router.put("/users/:id", async(req, res) => {
    try {
        await updateUser(req.params.id, req.body.name, req.body.age);
        res.json({message: "User updated"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error updating user"});
    }
});

router.delete("/users/:id", async(req, res) => {
    try {
        await deleteUser(req.params.id);
        res.json({message: "User deleted"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error deleting user"});
    }
});

app.use("/api", router);