import React from "react";
import Slideshow from "../components/slideshow/slideshow";
import Navbar from "../components/navbar/navbar";
import Landing from "../components/Main/landing";

const images = [
    "https://via.placeholder.com/1000x500?text=Image+1",
    "https://via.placeholder.com/1000x500?text=Image+2",
    "https://via.placeholder.com/1000x500?text=Image+3"
  ];


const LandingPage = () => {
  return (
    <div>
     <Navbar />
     <Slideshow images={images} />
     <Landing />
    </div>
  );
}

export default LandingPage;
