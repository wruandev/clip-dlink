const checkIfDefined = (env: string | undefined, errorMessage: string): string => {
  if (env === undefined) {
    console.error(errorMessage);

    return '';
  }

  return env;
};

const APIURL = checkIfDefined(
  import.meta.env.VITE_API_URL,
  'API_URL Environment variable is not defined'
);

const STORAGE_NAME = 'DLINK_ACCESS_TOKEN';

const SHORTLINK_REDIRECTURL = 'http://localhost:3010/';

export { APIURL, STORAGE_NAME, SHORTLINK_REDIRECTURL };
