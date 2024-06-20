import { Prisma, PrismaClient } from "@prisma/client";
import express from "express"

const prisma = new PrismaClient;
const app = express();

app.use(express.json());

app.get("/users", async(req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error fetching users"});
    }
});

app.get("/users/:id", async(req, res) => {
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

app.post("/users", async(req, res) => {
    try {
        await addUser(req.body.name, req.body.age);
        res.status(201).json({message: "User created"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error creating user"});
    }
});

app.get("/users/age/:age/:operator", async(req, res) => {
    try {
        const operator = req.params.operator === '<' ? '<' : req.params.operator === '>' ? '>' : '=';
        const users = await findUsersByAge(parseInt(req.params.age), operator);
        res.json(users);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error fet"})
    }
});

app.get("/users/name/:name/:operator", async(req, res) => {
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

app.put("/users/:id", async(req, res) => {
    try {
        await updateUser(req.params.id, req.body.name, req.body.age);
        res.json({message: "User updated"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error updating user"});
    }
});

app.delete("/users/:id", async(req, res) => {
    try {
        await deleteUser(req.params.id);
        res.json({message: "User deleted"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Error deleting user"});
    }
});

async function getUsers() {
    const users = await prisma.user.findMany();

    return users;
}

async function addUser(username: string, age: number) : Promise<void>  {
    await prisma.user.create({
        data: {
            name: username,
            age: age
        }
    })
}

async function deleteUser(id: string) {
    const deleteUser = await prisma.user.delete({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            age: true
        },
    });
}

async function updateUser(id: string, name: string, age: number) : Promise<void> {
    const updateUser = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            name: name,
            age: age,
        }
    });
}

async function findUniqueUser(id: string) {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    });
}

async function findUsersByAge(age: number, operator: '<' | '>' | '=') {
    let users;

    switch(operator) {
        case '<': 
            users = await prisma.user.findMany({
                where: {
                    age: {
                        lt: age
                    }
                }
            });
            break;
        case '>':
            users = await prisma.user.findMany({
                where: {
                    age: {
                        gt: age
                    }
                }
            });
            break;
        case '=':
            users = await prisma.user.findMany({
                where: {
                    age: {
                        equals: age
                    }
                }
            });
            break;
        default:
            throw new Error("Invalid operator");
    }
}

async function findUserByString(string: string, operator: 'contains' | 'does not contain') {
    let users;

    switch(operator) {
        case 'contains':
            users = await prisma.user.findMany({
                where: {
                    name: {
                        contains: string
                    }
                }
            });
            break;
        case 'does not contain':
            users = await prisma.user.findMany({
                where: {
                    name: {
                        not: {
                            contains: string
                        }
                    }
                }
            });
            break;
        default:
            throw new Error("Invalid operator");
    }

    return users;
}

app.listen(3000, () => {
    console.log("Servert started on http://localhost:3000")
});