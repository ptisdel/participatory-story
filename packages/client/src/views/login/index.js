import React from 'react';
import { Link } from "react-router-dom";
import { useLoginView } from './logic';

export const LoginView = () => {
  const [{
    email,
    error,
    password,
  }, {
    logIn,
    onChangeEmail,
    onChangePassword,
  }] = useLoginView();
  
  return (
    <div>
      <h1>Login</h1>
      <p>{error}</p>
      <form onSubmit={logIn} autoComplete='on'>
        <input placeholder='Email' name='email' type='email' onChange={onChangeEmail} value={email}/>
        <input placeholder='Password' name='password' onChange={onChangePassword} value={password} type='password'/>
        <input type='submit'/>
      </form>
      <p>Want to create an account? <Link to='/register'>Register</Link></p>
    </div>
  );
}