import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { ZodError, z } from 'zod';
import { findZodError } from '../utils';
import { APIURL, SHORTLINK_REDIRECTURL } from '../configs';

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

interface LinkType {
  url: string;
  slug: string;
}

interface AddLinkResponse {
  id: string;
  url: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const HeroCard = () => {
  const [url, setUrl] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [validation, setValidation] = useState({
    url: true,
    slug: true
  });

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState('');

  const [formError, setFormError] = useState<ZodError>();

  const errorMessages = {
    url: findZodError(formError, 'url')?.message,
    slug: findZodError(formError, 'slug')?.message
  };

  const apiUrl = `${APIURL}/links/public`;

  const AddLinkMutation = useMutation<AddLinkResponse, Error, LinkType>({
    mutationFn: ({ url, slug }) => {
      return fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, slug })
      })
        .then((response) => response.json())
        .then((response) => response.data as AddLinkResponse);
    },
    onSuccess: (data) => {
      setModalData(SHORTLINK_REDIRECTURL + data.slug);
      setShowModal(true);
    }
  });

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  const handleBlur = () => {
    const urlExist = url !== '';

    setValidation({
      ...validation,
      url: urlExist
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = validateForm();

    if (validated) {
      AddLinkMutation.mutate({ url, slug });
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

  const fullUrl = SHORTLINK_REDIRECTURL + slug;

  return (
    <>
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <form method="POST" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Put your url here</span>
              </label>
              <input
                type="text"
                value={url}
                placeholder="e.g. https://yoursite.com/really-long-link"
                className={
                  'input input-bordered text-sm ' + (errorMessages.url ? 'border-rose-600' : '')
                }
                onChange={handleUrlChange}
                onBlur={handleBlur}
              />

              {errorMessages.url && (
                <label className="label break-all ">
                  <p className="label-text-alt text-red-600">{errorMessages.url}</p>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Set your custom unique identifier</span>
              </label>
              <input
                type="text"
                placeholder="e.g. BlackFriday23"
                className="text-sm input input-bordered"
                value={slug}
                onChange={handleSlugChange}
              />
              {errorMessages.slug && (
                <label className="label break-all ">
                  <p className="label-text-alt text-red-600">{errorMessages.slug}</p>
                </label>
              )}
              <label className="label break-all">
                {slug !== '' ? (
                  <p className="label-text-alt">{fullUrl}</p>
                ) : (
                  <p className="label-text-alt">Skip it to generate randomly </p>
                )}
              </label>
            </div>
            <div className="form-control mt-2">
              <button className="btn btn-primary" type="submit">
                Clip it!
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal ${showModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Link successfully clipped!</h3>
          <div className="flex mt-5">
            <div className="input-group">
              <input
                type="text"
                placeholder="Link..."
                value={modalData}
                className="input input-bordered w-full focus:shadow-none"
                readOnly
              />
              <button
                className="btn btn-square"
                onClick={() => navigator.clipboard.writeText(modalData)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowModal((prev) => !prev)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroCard;
