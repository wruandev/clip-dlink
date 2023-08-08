import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import LinkList from '../components/LinkList';
import { useQuery } from 'react-query';
import { GetLinksResponse, LinkDataType } from '../types';
import { APIURL, STORAGE_NAME } from './../configs';
import { useState } from 'react';

const HomePage = () => {
  const token = localStorage.getItem(STORAGE_NAME);
  const navigate = useNavigate();
  const limitData = 6;

  const [pageData, setPageData] = useState(1);
  const [totalData, setTotalData] = useState(1);
  const [sortBy, setSortBy] = useState('date');

  const maxPage = Math.ceil(totalData / limitData);

  const { data, isLoading } = useQuery({
    queryFn: () => {
      return fetch(`${APIURL}/links?limit=${limitData}&page=${pageData}&sort=${sortBy}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      }).then((response) => {
        if (response.ok) {
          return response.json().then((response) => response as GetLinksResponse);
        }

        if (response.status === 401) {
          localStorage.removeItem(STORAGE_NAME);
          navigate('/', {
            replace: true
          });
        }
      });
    },
    onSuccess: (data) => {
      setTotalData(data?.pagination.total ? data?.pagination.total : 1);
    },
    queryKey: ['links', pageData, sortBy]
  });

  const handleNextPage = () => {
    if (pageData < maxPage) {
      setPageData(pageData + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageData > 1) {
      setPageData(pageData - 1);
    }
  };

  const handleSort = (sortType: string) => {
    if (sortBy !== sortType) {
      setSortBy(sortType);
    }
  };

  return (
    <div>
      <div className="shadow">
        <Navbar></Navbar>
      </div>
      <main className="min-h-screen mb-10">
        <section className=" mt-5 grid place-content-around grid-cols-1 md:grid-cols-2 gap-4 px-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="stat-title">Highest Link Visited</div>
              <div className="stat-value text-secondary text-3xl">
                {data ? data.extra.mostVisitedCount : 0}
              </div>
              <div className="stat-desc">Times visited by your customer</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title">Total Link</div>
              <div className="stat-value text-secondary text-3xl">
                {data ? data.pagination.total : 0}
              </div>
              <div className="stat-desc">Total link you saved</div>
            </div>
          </div>
        </section>

        <section className=" mt-10 px-5">
          <div className="flex items-center justify-between">
            <div className="dropdown dropdown-bottom">
              <label tabIndex={0} className="btn btn-outline btn-secondary btn-sm text-xs gap-2">
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
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                  />
                </svg>
                Sort by
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={() => handleSort('name')} className="text-sm">
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
                        d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                      />
                    </svg>
                    Name
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSort('date')} className="text-sm">
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
                        d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                      />
                    </svg>
                    Date Added
                  </button>
                </li>
              </ul>
            </div>

            <Link
              to="/links/add"
              className="btn btn-outline btn-secondary btn-sm text-xs text-gray-200 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add new link
            </Link>
          </div>
        </section>

        <section className=" mt-10 mb-10">
          <LinkList
            linkData={data && data.data ? data.data : new Array<LinkDataType>()}
            isLoading={isLoading}></LinkList>
        </section>
        <section className="">
          <div className="flex justify-center ">
            <div className="btn-group ">
              <button
                onClick={handlePrevPage}
                className={
                  'btn btn-outline btn-secondary' + (pageData === 1 ? 'btn-disabled' : '')
                }>
                «
              </button>
              <button className="btn btn-outline btn-secondary border-x-0">Page {pageData}</button>
              <button
                onClick={handleNextPage}
                className={
                  'btn btn-outline btn-secondary' + (pageData === maxPage ? 'btn-disabled' : '')
                }>
                »
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
};

export default HomePage;
