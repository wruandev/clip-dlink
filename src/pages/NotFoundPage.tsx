import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <>
      <div className="hero min-h-screen mb-10">
        <div className="hero-content flex-col w-4/5 md:w-2/3 lg:w-1/2">
          <div className="text-center">
            <h1 className="text-8xl font-bold">404</h1>
            <h1 className="text-4xl font-bold">Link Not Found</h1>
          </div>
          <a className="btn btn-secondary mt-4" href="/">
            Back to homepage
          </a>
          <div></div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default NotFoundPage;
