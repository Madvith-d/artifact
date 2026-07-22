import { createUser, findUserByUsername , findUserByEmail } from "../repository/user.repository";

export const register = async (
    payload : {
        username: string;
        email: string;
        password: string;
    }
) => {
    const existingUser = await findUserByUsername(payload.username);
    if(existingUser){
        throw new Error("User already exists");
    }

    const existingEmail = await findUserByEmail(payload.email);
    if(existingEmail){
        throw new Error("Email already exists");
    }

    const user = await createUser(payload);
    if(!user){
        throw new Error("Failed to create user");
    }
    return user;
}