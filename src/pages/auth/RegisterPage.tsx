import { FormEvent, useState } from 'react';
import Footer from '../../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { RegisterMutationType, RegisterResponse } from '../../types';
import { APIURL } from '../../configs';
import { ZodError, z } from 'zod';
import { findZodError } from '../../utils';

const registerFormSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: 'Name is required and must be 3 or more characters long' }),
    username: z
      .string()
      .min(4, { message: 'Username is required and must be 4 or more characters long' }),
    password: z
      .string()
      .min(6, { message: 'Password is required and must be 6 or more characters long' }),
    confirmPassword: z
      .string()
      .nonempty('Confirm password is required and must matches with password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password don't match",
    path: ['confirmPassword']
  });

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [formError, setFormError] = useState<ZodError>();

  const errorMessages = {
    fullname: findZodError(formError, 'fullname')?.message,
    username: findZodError(formError, 'username')?.message,
    password: findZodError(formError, 'password')?.message,
    confirmPassword: findZodError(formError, 'confirmPassword')?.message
  };

  const navigate = useNavigate();

  const registerMutation = useMutation<RegisterResponse, Error, RegisterMutationType>({
    mutationFn: ({ username, password, name }) => {
      return fetch(`${APIURL}/auths/register`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ username, password, name })
      }).then((response) => {
        if (response.ok) return response.json();

        if (response.status === 400) {
          throw new Error('There is an error');
        }

        throw new Error('Internal server error');
      });
    },
    onSuccess: () => {
      navigate('/auth/login');
    },
    onError: (err) => {
      alert(err.message);
    }
  });

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validateForm();

    if (result) {
      registerMutation.mutate({ username, password, name: fullname });
    }
  };

  const validateForm = () => {
    const result = registerFormSchema.safeParse({
      fullname,
      username,
      password,
      confirmPassword: cpassword
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
              <form method="POST" onSubmit={handleRegister}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your name</span>
                  </label>
                  <input
                    type="text"
                    value={fullname}
                    placeholder="Type your name here"
                    className={'input input-bordered text-sm w-full '}
                    onChange={(e) => {
                      setFullname(e.target.value);
                    }}
                  />
                  {errorMessages.fullname && (
                    <label className="label break-all ">
                      <p className="label-text-alt text-red-600">{errorMessages.fullname}</p>
                    </label>
                  )}
                </div>
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
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password here"
                    className="text-sm input input-bordered"
                    value={cpassword}
                    onChange={(e) => {
                      setcPassword(e.target.value);
                    }}
                  />
                  {errorMessages.confirmPassword && (
                    <label className="label break-all ">
                      <p className="label-text-alt text-red-600">{errorMessages.confirmPassword}</p>
                    </label>
                  )}
                  <label className="label break-all">
                    <p className="label-text-alt">
                      Already have an account?{' '}
                      <Link to="/auth/login" className="hover:underline">
                        Click here to login now
                      </Link>{' '}
                    </p>
                  </label>
                </div>
                <div className="form-control mt-2">
                  <button className="btn btn-primary" type="submit">
                    Register
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

export default RegisterPage;
