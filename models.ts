import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUsers() {
    const users = await prisma.user.findMany();

    return users;
}

export async function addUser(username: string, age: number) : Promise<void>  {
    await prisma.user.create({
        data: {
            name: username,
            age: age
        }
    })
}

export async function deleteUser(id: string) {
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

export async function updateUser(id: string, name: string, age: number) : Promise<void> {
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

export async function findUniqueUser(id: string) {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    });
}

export async function findUsersByAge(age: number, operator: '<' | '>' | '=') {
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

export async function findUserByString(string: string, operator: 'contains' | 'does not contain') {
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