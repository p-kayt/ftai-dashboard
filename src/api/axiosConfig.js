// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
    // .. where we make our configurations
    baseURL: 'https://ftai-api.monoinfinity.net'
});


// Also add/ configure interceptors && all the other cool stuff


export default instance;