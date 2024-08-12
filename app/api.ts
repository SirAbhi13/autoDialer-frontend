import axios from 'axios';  

let baseURL;

if (process.env.NEXT_PUBLIC_PROD === 'True') {  
    baseURL = process.env.NEXT_PUBLIC_PROD_BACKEND_ENDPOINT;  
} else {  
    baseURL = process.env.NEXT_PUBLIC_DEV_BACKEND_ENDPOINT;  
}

const instance = axios.create({  

    baseURL: baseURL, 
});  

export default instance;  