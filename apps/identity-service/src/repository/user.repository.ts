import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { db } from "../db";
import { hash } from "bcryptjs"
import crypto from "crypto"
const findUserByEmail = async (email: string) => {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user[0];
};

const findUserByUsername = async (username: string) => {
    const user = await db.select().from(users).where(eq(users.username, username));
    return user[0];
};

const createUser = async (user: {
    username: string;
    email: string;
    password: string;
}) => {
    try{
    const id = crypto.randomUUID();
    const {email , username , password} = user;
    const hashedPassword = await hash(password, 10);
    const newUser = await db.insert(users).values({
        id,
        email,
        username,
        passwordHash: hashedPassword
    }).returning();
    return newUser[0];
    }catch(error){
        
        throw new Error("Failed to create user");
    }
};

export {
    findUserByEmail,
    findUserByUsername,
    createUser
};