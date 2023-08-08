import { Link, useNavigate } from 'react-router-dom';
import { DeleteLinkMutationType, DeleteLinkResponse, LinkDataType } from '../types';
import { useMutation, useQueryClient } from 'react-query';
import { APIURL, SHORTLINK_REDIRECTURL, STORAGE_NAME } from '../configs';

interface LinkListProps {
  isLoading?: boolean;
  linkData: LinkDataType[];
}

const LinkList = ({ linkData, isLoading }: LinkListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteLinkMutation = useMutation<DeleteLinkResponse, Error, DeleteLinkMutationType>({
    mutationFn: ({ id }) => {
      const token = localStorage.getItem(STORAGE_NAME);

      return fetch(`${APIURL}/links/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token
        }
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
      queryClient.invalidateQueries('links');
    },
    onError: (err) => {
      alert(err.message);
    }
  });

  const handleDelete = (linkId: string) => {
    if (!confirm('Are you sure to delete this data?')) {
      return false;
    }

    deleteLinkMutation.mutate({ id: linkId });
  };

  if (isLoading) {
    return <h1 className=" text-center">Loading data...</h1>;
  }

  const itemLeft = 3 - (linkData.length % 3);
  return (
    <div className="flex justify-center items-center w-full p-0 mx-auto">
      <div className="flex flex-wrap gap-5 justify-evenly items-center w-[99%]">
        {linkData.map((link) => {
          return (
            <div
              key={link.slug}
              className=" border-rose-600 card card-compact w-96 md:w-80 xl:w-96 shadow-md rounded-box">
              <div className="card-body">
                <div className="card-actions justify-end">
                  <div className="dropdown dropdown-left">
                    <label tabIndex={0} className="btn btn-xs btn-square btn-ghost">
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
                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                      </svg>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(SHORTLINK_REDIRECTURL + link.slug);
                          }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                            />
                          </svg>
                          Copy Link
                        </button>
                      </li>
                      <li>
                        <Link to={`/links/${link.slug}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          Edit item
                        </Link>
                      </li>
                      <li>
                        <button
                          className="text-red-500"
                          onClick={() => {
                            handleDelete(link.id);
                          }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                          Delete item
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col border-rose-600 w-full">
                  <div className="grid h card mx-0 my-0 rounded-box place-items-center">
                    <p className="font-bold text-secondary text-xl hover:underline hover:decoration-wavy cursor-pointer">
                      {link.slug}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-right">{link.url}</p>

                <p className="text-xs text-gray-500 text-right">
                  Added at {link.createdAt.split('T')[0]}
                </p>
              </div>
            </div>
          );
        })}
        {Array(itemLeft)
          .fill(0)
          .map((v) => {
            return <div key={v} className="w-96 md:w-80 xl:w-96"></div>;
          })}
      </div>
    </div>
  );
};

export default LinkList;
