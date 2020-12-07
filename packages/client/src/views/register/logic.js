import { createUser } from "../../services/firebase";
import { useState } from 'react';

export const useRegisterView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChangeEmail = e => {
    setEmail(e.target.value);
  }

  const onChangePassword = e => {
    setPassword(e.target.value);
  }

  const register = async e => {
    e.preventDefault();

    createUser({ email, password }).then((userCredential) => {
      const user = userCredential.user;
      alert(`Registered ${user.email}!`);
    })
    .catch((error) => {
      setError(`Error ${error.code}: ${error.message}`);
    });

    setEmail('');
    setPassword('');
  };

  return [{
    email,
    error,
    password,
  }, {
    register,
    onChangeEmail,
    onChangePassword,
  }]
};


