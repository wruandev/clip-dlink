import { FormEvent, useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { APIURL, SHORTLINK_REDIRECTURL, STORAGE_NAME } from '../../configs';
import {
  EditLinkMutationType,
  EditLinkResponse,
  GetOneLinkResponse,
  LinkDataType
} from '../../types';
import { ZodError, z } from 'zod';
import { findZodError } from '../../utils';

const formSchema = z.object({
  url: z.string().url('URL is required and must be a proper URL'),
  slug: z
    .union([
      z.string().min(4, { message: 'Custom ID must be 4 or more characters long' }),
      z.string().length(0)
    ])
    .optional()
    .transform((e) => (e === '' ? undefined : e))
});

const EditLinkPage = () => {
  const { id } = useParams();
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [link, setLink] = useState<LinkDataType>();
  const [formError, setFormError] = useState<ZodError>();

  const errorMessages = {
    url: findZodError(formError, 'url')?.message,
    slug: findZodError(formError, 'slug')?.message
  };

  const navigate = useNavigate();

  const editLinkMutation = useMutation<EditLinkResponse, Error, EditLinkMutationType>({
    mutationFn: ({ url, slug }) => {
      const token = localStorage.getItem(STORAGE_NAME);

      return fetch(`${APIURL}/links/${link?.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ url, slug })
      }).then((response) => {
        if (response.ok) return response.json();

        if (response.status === 400) {
          throw new Error('Bad Request from user');
        }

        if (response.status === 401) {
          localStorage.removeItem(STORAGE_NAME);

          navigate('/login', {
            replace: true
          });
        }

        if (response.status === 500) {
          throw new Error('Internal server error');
        }
      });
    },
    onSuccess: () => {
      navigate('/home');
    },
    onError: (err) => {
      alert(err.message);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = validateForm();

    if (validated) {
      editLinkMutation.mutate({ url, slug });

      setFormError(undefined);
    }
  };

  const validateForm = () => {
    const result = formSchema.safeParse({
      url,
      slug
    });

    if (!result.success) {
      setFormError(result.error);

      return false;
    }

    return true;
  };

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_NAME);

    fetch(`${APIURL}/links/${id}`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((response) => response as GetOneLinkResponse);
        }

        if (response.status === 401) {
          localStorage.removeItem(STORAGE_NAME);
          navigate('/', {
            replace: true
          });
        }
      })
      .then((response) => response?.data as LinkDataType)
      .then((data) => {
        setLink(data);
        setUrl(data.url);
        setSlug(data.slug);
      });
  }, [id, navigate]);

  return (
    <>
      <div className="shadow">
        <Navbar></Navbar>
      </div>

      <main className="min-h-screen mt-1">
        <form method="POST" onSubmit={handleSubmit}>
          <section className="mx-auto px-5 p-5">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                  htmlFor="grid-first-name">
                  Your link
                </label>
                <textarea
                  autoFocus
                  className="textarea textarea-bordered block w-full"
                  id="grid-first-name"
                  placeholder="e.g. https://yoursite.com/really-long-link"
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                  value={url}
                />
                {errorMessages.url && (
                  <label className="label break-all ">
                    <p className="label-text-alt text-red-600">{errorMessages.url}</p>
                  </label>
                )}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
                  htmlFor="grid-last-name">
                  Custom ID
                </label>
                <input
                  className="input input-bordered block w-full"
                  id="grid-last-name"
                  type="text"
                  placeholder="e.g. BlackFriday23"
                  onChange={(e) => {
                    setSlug(e.target.value);
                  }}
                  value={slug}
                />
                {errorMessages.slug && (
                  <label className="label break-all ">
                    <p className="label-text-alt text-red-600">{errorMessages.slug}</p>
                  </label>
                )}
                {slug === '' ? (
                  <label className="label text-sm break-all">{`${SHORTLINK_REDIRECTURL}<random>`}</label>
                ) : (
                  <label className="label text-sm break-all">{`${SHORTLINK_REDIRECTURL}${slug}`}</label>
                )}
              </div>
              <div className="w-full md:w-1/2 px-3 mt-5 justify-end">
                <div className="md:w-2/3">
                  <button className="btn btn-md w-full sm:w-auto btn-secondary" type="submit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 me-2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    Update Link
                  </button>
                </div>
              </div>
            </div>
          </section>
        </form>
      </main>
      <Footer></Footer>
    </>
  );
};

export default EditLinkPage;
