import React from "react";
import HeroSVG from "../../assets/images/Group Chat-rafiki.png";
// import HeroSVG from "../../assets/images/Messaging fun-rafiki.svg";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-50 flex items-center justify-center py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Text Content */}
          <div className="text-center md:text-left space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Where <span className="text-indigo-600">Fearless Voices</span>{" "}
              Rise & <span className="text-indigo-600">Untamed Stories</span>{" "}
              Come to Life
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-light mb-4 md:mb-7">
              Dive in, scribble your thoughts, and vibe with the community!
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-6 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold 
                hover:bg-indigo-700 transition-all duration-300 
                transform hover:scale-105 active:scale-95 
                shadow-lg inline-block"
              >
                Jump In Now!
              </Link>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center md:block">
            <img
              src={HeroSVG}
              alt="Fun illustration"
              className="w-3/4 md:w-full h-auto max-w-md mx-auto 
              transform hover:rotate-3 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
