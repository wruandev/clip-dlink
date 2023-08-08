import { FormEvent, useState } from 'react';
import Footer from '../../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { LoginMutationType, LoginResponse } from '../../types';
import { APIURL, STORAGE_NAME } from '../../configs';
import { ZodError, z } from 'zod';
import { findZodError } from '../../utils';

const loginFormSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required')
});

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<ZodError>();

  const navigate = useNavigate();

  const LoginMutation = useMutation<LoginResponse, Error, LoginMutationType>({
    mutationFn: ({ username, password }) => {
      return fetch(`${APIURL}/auths/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      }).then((response) => {
        if (response.ok) return response.json();

        if (response.status === 400) {
          throw new Error('Wrong username or password');
        }

        throw new Error('Internal server error');
      });
    },
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_NAME, data.accessToken);
      navigate('/home');
    },
    onError: (err) => {
      alert(err.message);
    }
  });

  const errorMessages = {
    username: findZodError(formError, 'username')?.message,
    password: findZodError(formError, 'password')?.message
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = validateForm();

    if (validated) {
      LoginMutation.mutate({ username, password });
    }
  };

  const validateForm = () => {
    const result = loginFormSchema.safeParse({
      username,
      password
    });

    if (!result.success) {
      setFormError(result.error);

      return false;
    }

    return true;
  };

  return (
    <>
      <div className="hero min-h-screen mb-10">
        <div className="hero-content flex-col w-4/5 md:w-2/3 lg:w-1/2">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Clip D'Link</h1>
          </div>
          <div className="card flex-shrink-0 w-full shadow-2xl bg-base-100">
            <div className="card-body">
              <form method="POST" onSubmit={handleLogin}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    placeholder="Type your username here"
                    className={'input input-bordered text-sm w-full '}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />

                  {errorMessages.username && (
                    <label className="label break-all ">
                      <p className="label-text-alt text-red-600">{errorMessages.username}</p>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Type your password here"
                    className="text-sm input input-bordered"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  {errorMessages.password && (
                    <label className="label break-all ">
                      <p className="label-text-alt text-red-600">{errorMessages.password}</p>
                    </label>
                  )}
                  <label className="label break-all">
                    <p className="label-text-alt">
                      Don't have an account?{' '}
                      <Link to="/auth/register" className="hover:underline">
                        Click here to register now
                      </Link>{' '}
                    </p>
                  </label>
                </div>
                <div className="form-control mt-2">
                  <button className="btn btn-primary" type="submit">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default LoginPage;
