import { create } from '@web3-storage/w3up-client'


const createClient  = () => {
    return create(); 
}


const start = async () => {
try {
    await createClient();
    
    } catch (error) {
        ﬂconsole.log(error);
    }
}
start();