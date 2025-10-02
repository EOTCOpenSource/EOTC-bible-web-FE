import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import VerseOfTheDay from "./VerseOfTheDay";
import About from "./About";
import KeyFeatures from "./KeyFeatures";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <VerseOfTheDay />
      <About />
      <KeyFeatures />
    </div>
  );
};

export default LandingPage;
