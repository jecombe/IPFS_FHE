import { create } from '@web3-storage/w3up-client'


const createClient  = () => {
    return create(); 
}


const createSpace = async (name) => {
    return client.createSpace(name);
}

const login = async (log) => {
    return client.login(log);

}

const start = async () => {
try {
    await createClient();
    const space = await createSpace();

    } catch (error) {
        console.log(error);
    }
}

start();