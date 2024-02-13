import { create } from '@web3-storage/w3up-client'
import dotenv from 'dotenv';

const createClient  = () => {
    return create(); 
}

const createSpace = async (name, client) => {
    return client.createSpace(name);
}

const login = async (log) => {
    return client.login(log);
}

const start = async () => {
try {
    const client = await createClient();
    const log = await login(process.env.ACCOUNT)
    const space = await createSpace("testing",client);

    } catch (error) {
        console.log(error);
    }
}

start();