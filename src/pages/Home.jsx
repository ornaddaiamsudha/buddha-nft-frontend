import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Main Content - Centered both vertically and horizontally */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-12">

        {/* Buddha Image with glow effect */}
        <div className="relative mb-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-10"></div>
          <div className="relative z-10 h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 rounded-full overflow-hidden shadow-lg">
            <img
              src="/buddha-statue.png"
              alt="Buddha Statue"
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Welcome to BuddhaNFT Marketplace
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            Mint, auction, and trade sacred amulets securely on blockchain.
          </p>
        </div>
      </div>

      {/* Optional subtle footer indicator */}
      <div className="pb-6 flex justify-center">
        <div className="w-12 h-1 rounded-full bg-blue-100"></div>
      </div>
    </div>
  );
};

export default Home;
