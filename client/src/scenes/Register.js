import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const error = await supabase.auth.signUp({ email, password })[2];
            if (error) alert(error.message);
            else {
                alert("Thank you for registering");
                navigate('/');
            }
        } catch (e) {
            console.log("there was an error registering", e.message);
        }
    }

    return (
        <div className="Register-form">
            <h2>Register</h2>
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
                <a href="/login">Login</a>
            </form>
        </div>
    )
}


export default Register;