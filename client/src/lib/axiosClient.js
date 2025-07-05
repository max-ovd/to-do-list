import axios from 'axios';
import { supabase } from '../supabaseClient';

const api = axios.create();

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
        config.baseURL = process.env.DATABSE_URL;
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('client side middleware')
    return config;
})


export default api;