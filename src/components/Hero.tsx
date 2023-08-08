import HeroCard from './HeroCard';

const Hero = () => {
  return (
    <div className="hero min-h-screen ">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Clip your link!</h1>
          <p className="py-6">
            Shorter link can increase your audience rate and they will love it because it's easier
            to remember!
          </p>
        </div>
        <HeroCard></HeroCard>
      </div>
    </div>
  );
};

export default Hero;
