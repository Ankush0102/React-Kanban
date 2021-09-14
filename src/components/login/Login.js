import React,{useState} from 'react';
import { useHistory } from 'react-router';
import {Button, Col,Row} from 'react-bootstrap';
import './Login.css';
import {USERS} from '../../users/Users';
import warningIcon from '../../assets/images/warning-vectors.png';
import axios from 'axios';


const API_KEY = "AIzaSyCcnqkzK3phluG2EM6NrUPRJMnR7UlMt0g"

const Login = (props) => {
    const [userDetails, setUserDetails] = useState({ email: "", password: "" })
    const [error,setError] = useState("");
    const [isLoggedIn,setIsLoggedIn] = useState(true)
    const history = useHistory();

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const handleSignup = (e) => {
        e.preventDefault();
        const url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
        const credentials = {
            email: userDetails.email,
            password: userDetails.password,
            returnSecureToken:true
        }
        axios.post(url + API_KEY, credentials)
        .then(res => {
            console.log(res)
            const tokenId = res.data.idToken
            const expireDate = res.data.expiresIn
            localStorage.setItem('token', tokenId)
            localStorage.setItem('expiresIn', new Date(new Date().getTime() + (expireDate) * 1000))
        })
        setIsLoggedIn(!isLoggedIn)
    }

    const handleLogin = (e) => {
        e.preventDefault();
        // const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
        // const credentials = {
        //     email: userDetails.email,
        //     password: userDetails.password,
        //     returnSecureToken:true
        // }
        // axios.post(url + API_KEY, credentials)
        //     .then(res => {
        //         const tokenId = res.data.idToken
        //         const expireDate = res.data.expiresIn
        //         localStorage.setItem('token', tokenId)
        //         localStorage.setItem('expiresIn', new Date(new Date().getTime() + (expireDate) * 1000))
        //         props.history.push("/create-board")
        //     })
        
        for(let user of USERS){
            let {email , password, tokenId} = user
            if(email === userDetails.email && password === userDetails.password){
                localStorage.setItem("token", tokenId)
                history.push("/create-board")
            }else {
                setError("log in credential failed")
            }
        }
    }


    return (
        <div className="login-page">
            <Row>
                <Col md={6} className="bg-icon">
                </Col>
                <Col md={6} className="right_side">
                {isLoggedIn ? (
                    <form>
                        <div className="form-inner">
                            <h1 className="header">Log in</h1>
                            {/* {error !== "" ? (<div className="error">
                                <img className="warning-icon" src={warningIcon}/>{error}</div>):""} */}
                            <div className="form-group">
                            <div className="mb-6">
                            <label htmlFor="email">Email:</label>
                            </div>                              
                                <input type="email" name="email" value={userDetails.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                            <div className="mb-6">
                            <label htmlFor="password">Password:</label>
                            </div>                              
                                <input type="password" name="password" value={userDetails.password} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <Button type="submit" variant="outline-success" onClick={handleLogin}>Log in</Button>
                            </div>
                            <div>Don't have an account? <a onClick={() => setIsLoggedIn(!isLoggedIn)}>Sign Up</a></div>
                        </div>
                        </form> ) : (
                            <form>
                            <div className="form-inner">
                            <h1 className="header">Sign Up</h1>
                            {error !== "" ? (<div className="error">
                                <img className="warning-icon" src={warningIcon}/>{error}</div>):""}
                            <div className="form-group">
                            <div className="mb-6">
                            <label htmlFor="email">Email:</label>
                            </div>                              
                                <input type="email" name="email" value={userDetails.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                            <div className="mb-6">
                            <label htmlFor="password">Password:</label>
                            </div>                              
                                <input type="password" name="password" value={userDetails.password} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <Button type="submit" variant="outline-success" onClick={handleSignup}>Sign Up</Button>
                            </div>
                            <div>Already have an account? <a onClick={() => setIsLoggedIn(!isLoggedIn)}>log in</a></div>
                        </div>
                        </form> 
                        )}
                    
                </Col>
            </Row>
        </div>
    )
};

// const mapStateToProps = state => ({
//     state
// })

// const mapDispatchToProps = dispatch => ({
//     authSuccess: auth => dispatch({ type: "AUTH_SUCCESS", payload: auth })
// })

export default Login;