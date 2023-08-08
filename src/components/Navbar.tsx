import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STORAGE_NAME } from '../configs';

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  useEffect(() => {
    const storageToken = localStorage.getItem(STORAGE_NAME);

    if (storageToken) {
      setToken(storageToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem(STORAGE_NAME);
    navigate('/', {
      replace: true
    });
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li>{token && <Link to="/home">Homepage</Link>}</li>
            <li>
              <a>About</a>
            </li>
            <li>
              <a>Privacy Policy</a>
            </li>
            <li>
              {token === '' ? (
                <Link to="/auth/login">Login</Link>
              ) : (
                <button onClick={logout}>Logout</button>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/home" className="btn btn-ghost no-animation normal-case text-xl">
          Clip D'link
        </Link>
      </div>

      <div className="navbar-end">
        {token === '' && (
          <Link to="/auth/register" className="btn btn-secondary btn-sm text-xs">
            Register Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
