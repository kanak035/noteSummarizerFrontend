import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-600">
      <p className="mb-1">
        Developed  by <span className="font-medium">Kanak Dhiman</span>
      </p>
      <p>
        <a
          href="https://github.com/kanak035"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
        {" • "}
        <a
          href="https://www.linkedin.com/in/kanak3/"
          className="text-blue-600 hover:underline"
        >
          Contact
        </a>
      </p>
    </footer>
  );
};

export default Footer;
