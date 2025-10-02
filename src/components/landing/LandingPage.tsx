import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import VerseOfTheDay from "./VerseOfTheDay";
import About from "./About";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <VerseOfTheDay />
      <About />
    </div>
  );
};

export default LandingPage;
