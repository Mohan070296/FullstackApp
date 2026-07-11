import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#141414] text-gray-500 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Netflix</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/jobs" className="hover:underline">Jobs</Link></li>
              <li><Link to="/press" className="hover:underline">Press</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/account" className="hover:underline">Account</Link></li>
              <li><Link to="/media-center" className="hover:underline">Media Center</Link></li>
              <li><Link to="/investors" className="hover:underline">Investor Relations</Link></li>
              <li><Link to="/legal" className="hover:underline">Legal Notices</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/facebook" className="hover:underline">Facebook</Link></li>
              <li><Link to="/twitter" className="hover:underline">Twitter</Link></li>
              <li><Link to="/instagram" className="hover:underline">Instagram</Link></li>
              <li><Link to="/youtube" className="hover:underline">YouTube</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Settings</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:underline">Help Center</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
              <li><Link to="/cookies" className="hover:underline">Cookie Preferences</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm mb-2">
              © 2024 MovieFlix. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <span>Service Code</span>
            <span>Privacy</span>
            <span>Cookies</span>
            <span>Accessibilty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;