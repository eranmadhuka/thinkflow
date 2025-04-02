import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-8">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">
              About ThinkFlow
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              A social media app created by Eran Madhuka for learning and
              exploration.
            </p>
          </section>

          {/* Creator Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-3">
              Meet the Creator
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Hi, I’m Eran Madhuka, an IT student at SLIIT University. I built
              ThinkFlow as a learning project to explore web development and
              create something fun and functional. This app reflects my passion
              for coding and innovation.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                GitHub:{" "}
                <a
                  href="https://github.com/eranmadhuka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  github.com/eranmadhuka
                </a>
              </p>
              <p className="text-gray-700">
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/eranmadhuka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  linkedin.com/in/eranmadhuka
                </a>
              </p>
              <p className="text-gray-700">
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/eran.madhuka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  instagram.com/eran.madhuka
                </a>
              </p>
              <p className="text-gray-700">
                Portfolio:{" "}
                <a
                  href="https://eranmadhuka.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  my-portfolio-five-ecru-46.vercel.app
                </a>
              </p>
            </div>
          </section>

          {/* App Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
              What is ThinkFlow?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              ThinkFlow is a social media app I created as a learning project.
              Users can create accounts, post text with images and videos, like,
              follow, unfollow, and comment on posts. It also features real-time
              notifications to keep you connected. This app is a playground for
              me to experiment with modern web technologies and build something
              useful.
            </p>
          </section>

          {/* Technologies Section */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
              Technologies Used
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-black font-semibold">React.js</p>
                <p className="text-gray-600 text-sm">
                  For building the dynamic frontend.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-black font-semibold">Tailwind CSS</p>
                <p className="text-gray-600 text-sm">
                  For styling with utility-first CSS.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-black font-semibold">Spring Boot</p>
                <p className="text-gray-600 text-sm">
                  For the robust backend API.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-black font-semibold">MongoDB</p>
                <p className="text-gray-600 text-sm">
                  For storing user data and posts.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
