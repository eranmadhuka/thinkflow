import React from "react";
import HeroSVG from "../assets/images/hero.png";

const Home = () => {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side - Text Content */}
        <div className="text-left">
          <h1 className="text-9xl md:text-6xl font-semibold text-gray-900 mb-6">
            Human Stories & Ideas
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            A place to read, write, and deepen your understanding.
          </p>
          <button className="bg-emerald-700 text-white px-8 py-3 rounded-md hover:bg-emerald-800 transition-colors duration-200">
            Start Reading
          </button>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block">
          <img
            src={HeroSVG}
            alt="Featured illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
