import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submitted login")
        console.log(email, password);

        try {
            const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
            console.log(session, error);
            if (error) alert(error.message);
            else alert("Thank you for logging in");
            navigate('/');
        } catch (e) {
            console.log("Failed to log in: ", e.message);
        }
    }

    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={ handleSubmit }>     
                <div className="input-field">
                    <label>email</label>
                    <input 
                        type="email"
                        placeholder="placeholder"
                        value={ email }
                        onChange={(e) => setEmail(e.target.value)}
                        required={ true }
                    />
                </div>

                <div className="input-field">
                    <label>password</label>
                    <input 
                        type="password"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                        required={ true }
                    />
                </div>
                
                <button>Submit</button>
                <a href="/register">Register</a>
            </form>
        </div>
    )

}


export default Login;