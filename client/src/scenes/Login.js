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
        <section className="container">
            <form onSubmit={ handleSubmit }>
                <h3>Login</h3>
    
                <div className="input-field">
                    <input 
                        autoFocus
                        type="email"
                        placeholder="Email"
                        value={ email }
                        onChange={(e) => setEmail(e.target.value)}
                        required={ true }
                    />
                </div>

                <div className="input-field">
                    <input 
                        type="Password"
                        placeholder="Password"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                        required={ true }
                    />
                </div>
                
                <button class="secondary submit-button">Submit</button>
                <br></br>
                <small>First time user? <a href="/register">Register</a> instead</small>
            </form>
        </section>
    )

}


export default Login;