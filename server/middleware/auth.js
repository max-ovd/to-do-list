import { supabase } from '../supabaseClient.js'

export async function authMiddleware(req, res, next) {

    console.log('server side middleware')

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Missing token' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
    

    req.user = data.user;
    next();
}