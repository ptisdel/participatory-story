import React from 'react';
import { Link } from "react-router-dom";
import { useRegisterView } from './logic';

export const RegisterView = () => {
  const [{
    email,
    error,
    password,
  }, {
    register,
    onChangeEmail,
    onChangePassword,
  }] = useRegisterView();
  
  return (
    <div>
      <h1>Register</h1>
      <p>{error}</p>
      <form onSubmit={register}>
        <input placeholder='Email' name='email' type='email' onChange={onChangeEmail} value={email}/>
        <input placeholder='Password' name='password' onChange={onChangePassword} value={password} type='password'/>
        <input type='submit'/>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}