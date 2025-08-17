import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        AI Meeting Notes Summarizer
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        Upload your meeting transcript, add a custom instruction, and instantly
        generate a concise summary. Edit the result and share it with your team
        via email.
      </p>
      <Link
        to="/summarize"
        className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
