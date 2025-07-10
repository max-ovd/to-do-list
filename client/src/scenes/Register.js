import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import api from "../lib/axiosClient";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) alert(error.message);
            else {
                alert("Thank you for registering");
                api.post('/items/init-account');
                navigate('/');
            }
        } catch (e) {
            console.log("there was an error registering", e.message);
        }
    }

    return (
        <section className="container">
            <form onSubmit={ handleSubmit }>     
                <h3>Register</h3>

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
                        type="password"
                        placeholder="Password"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                        required={ true }
                    />
                </div>
                
                <button class="secondary submit-button">Submit</button>
                <br></br>
                <small>Have an account? <a href="/login">Login</a> instead</small>
            </form>
        </section>
    )
}


export default Register;