import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-black pt-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">About MovieFlix</h1>
      
      <div className="max-w-4xl space-y-8 text-gray-300 text-lg leading-relaxed">
        <p>
          MovieFlix is India's premier movie streaming platform, offering unlimited access to thousands of movies, TV shows, and exclusive content.
          We're committed to providing the best viewing experience for our customers.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8">Our Mission</h2>
        <p>
          To entertain the world by providing high-quality, on-demand streaming content that caters to diverse tastes and preferences.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8">Our Story</h2>
        <p>
          Founded in 2024, MovieFlix started with a simple idea - to make movie watching convenient and accessible for everyone.
          Since then, we've grown to become one of the largest streaming platforms in the country, with millions of satisfied customers.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8">What We Offer</h2>
        <ul className="list-disc pl-8 space-y-2">
          <li>Thousands of movies and TV shows in multiple languages</li>
          <li>4K Ultra HD streaming on supported devices</li>
          <li>Offline downloads for mobile devices</li>
          <li>Multiple profiles per account</li>
          <li>No ads, no commitments, cancel anytime</li>
          <li>Exclusive original content</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8">Contact Us</h2>
        <p>
          Have questions or feedback? We'd love to hear from you. Visit our Contact page or reach out to our support team.
        </p>
      </div>
    </div>
  );
};

export default About;