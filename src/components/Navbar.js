import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div className="flex">
            <a href="/" className="text-white mr-4">
              Home
            </a>
            <a href="/blogs" className="text-white mr-4">
              Blogs
            </a>
            <a href="/contact" className="text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
