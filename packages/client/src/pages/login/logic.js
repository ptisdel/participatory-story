import { signIn } from "../../services/firebase";
import { useState } from 'react';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChangeEmail = e => {
    setEmail(e.target.value);
  }

  const onChangePassword = e => {
    setPassword(e.target.value);
  }

  const logIn = async e => {
    e.preventDefault();

    signIn({ email, password }).then((userCredential) => {
      const user = userCredential.user;
      alert(`Welcome ${user.email}!`);
      console.log(user);
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
    logIn,
    onChangeEmail,
    onChangePassword,
  }]
};
