import React from 'react';
import { Link } from "react-router-dom";
import { useLogin } from './logic';

export const LoginPage = () => {
  const [{
    email,
    error,
    password,
  }, {
    logIn,
    onChangeEmail,
    onChangePassword,
  }] = useLogin();
  
  return (
    <div>
      <h1>Login</h1>
      <p>{error}</p>
      <form onSubmit={logIn} autocomplete='on'>
        <input placeholder='Email' name='email' type='email' onChange={onChangeEmail} value={email}/>
        <input placeholder='Password' name='password' onChange={onChangePassword} value={password} type='password'/>
        <input type='submit'/>
      </form>
      <p>Want to create an account? <Link to='/register'>Register</Link></p>
    </div>
  );
}