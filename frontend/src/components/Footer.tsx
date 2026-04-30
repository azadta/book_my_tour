import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white pt-5 pb-2 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-lg font-bold mb-4">Book My Tour</h2>
          <p className="text-sm">
            Discover handpicked travel experiences and unforgettable adventures
            across the glob.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Most Rated Desinations</li>
            <li className="hover:underline cursor-pointer">Offer Packages</li>
            <li className="hover:underline cursor-pointer">Provided Facilities</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">FAQs</li>
            <li className="hover:underline cursor-pointer">Help Center</li>
            <li className="hover:underline cursor-pointer">Cancellation Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Connected with us</h3>
          <p>Email: support@bookmytour.com</p>
          <p>Phone: +91 0000000000</p>
          <div className="flex space-x-4 text-xl">
            <a>
              <FaFacebook className="hover:text-blue-500" />
            </a>
            <a>
              <FaInstagram className="hover:text-blue-500" />
            </a>
            <a>
              <FaTwitter className="hover:text-blue-500" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-10 border-t border-white pt-4">
        {new Date().getFullYear()} bookmytour@ All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
