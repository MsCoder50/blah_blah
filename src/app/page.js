'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showSweetMessage, setShowSweetMessage] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentGif, setCurrentGif] = useState('');

  const questions = [
    "Do you love me? 💕",
    "Are you sure? 🥺",
    "Are you 100% sure? 😢",
    "Are you 1000% sure? 😭",
    "Are you 10000% sure? 💔",
    "Last chance... really sure? 🥹",
    "Final attempt... absolutely sure? 😿"
  ];

  // Fallback static GIFs in case API fails
  const fallbackGifs = [
    "https://media.giphy.com/media/3o7TKDEqop6pvJ6QOk/giphy.gif", // Cute puppy for first question, // Cute puppy for first question
    "https://media.giphy.com/media/3o7TKDEqop6pvJ6QOk/giphy.gif", // Sad puppy
    "https://media.giphy.com/media/3o7TKDEqop6pvJ6QOk/giphy.gif", // Crying
    "https://media.giphy.com/media/3o7TKDEqop6pvJ6QOk/giphy.gif", // Tears
    "https://media.giphy.com/media/3o7TKDEqop6pvJ6QOk/giphy.gif", // Broken heart
    "https://media.giphy.com/media/3o7TKDEqop6pvJ6QOk/giphy.gif", // Pleading
    "https://media.giphy.com/media/3o7TKDEqop6pvJ6QOk/giphy.gif"  // Cat meow
  ];

  // Special love heart GIF for when user says Yes
  const loveHeartGif = "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif";

  const gifQueries = [
    "love heart cute",
    "sad puppy eyes",
    "crying sad face",
    "tears crying",
    "broken heart sad",
    "pleading cute",
    "cat sad meow"
  ];

  const sweetMessages = [
    "Yay! I love you too! 💖✨",
    "I knew you&apos;d say yes! 🥰",
    "You&apos;re the best! 💕",
    "My heart is so happy! 💝",
    "You made my day! 🌟💖"
  ];

  const finalMessage = "I knew it already but nakhre karne hain naa.. meow meow 😸 BTW thank you.. 💕";

  // Working GIPHY API key - this should work
  const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';

  const fetchGif = async (query) => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=1&rating=g`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data[0].images.fixed_height.url;
      }
    } catch (error) {
      console.log('Error fetching GIF:', error);
    }
    return null;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Try to fetch GIF from API, fallback to static GIF if it fails
    // Show different GIFs for each question
    fetchGif(gifQueries[currentQuestion]).then(gifUrl => {
      if (gifUrl) {
        setCurrentGif(gifUrl);
      } else {
        // Use fallback static GIF
        setCurrentGif(fallbackGifs[currentQuestion]);
      }
    });
  }, [currentQuestion, gifQueries, fallbackGifs]);

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log('State changed - showSweetMessage:', showSweetMessage, 'showFinalMessage:', showFinalMessage);
  }, [showSweetMessage, showFinalMessage]);

  const handleYes = () => {
    console.log('Yes clicked, currentQuestion:', currentQuestion);
    if (currentQuestion === 0) {
      // Show sweet message for first question
      console.log('Setting showSweetMessage to true');
      setShowSweetMessage(true);
      console.log('State should now be updated');
    } else {
      // For any other question, also show sweet message
      console.log('Setting showSweetMessage to true for question:', currentQuestion);
      setShowSweetMessage(true);
    }
  };

  const handleNo = () => {
    console.log('No clicked, currentQuestion:', currentQuestion);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAttempts(attempts + 1);
    } else {
      console.log('Setting showFinalMessage to true');
      setShowFinalMessage(true);
    }
  };

  const moveNoButton = () => {
    // Only move the button if we've exhausted all questions
    if (currentQuestion >= questions.length - 1) {
      const buttonWidth = 200; // Approximate button width
      const buttonHeight = 100; // Approximate button height
      const maxX = Math.max(0, window.innerWidth - buttonWidth);
      const maxY = Math.max(0, window.innerHeight - buttonHeight);
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      setNoButtonPosition({ x: newX, y: newY });
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setShowFinalMessage(false);
    setShowSweetMessage(false);
    setAttempts(0);
    setNoButtonPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleResize = () => {
      const buttonWidth = 200;
      const buttonHeight = 100;
      const maxX = Math.max(0, window.innerWidth - buttonWidth);
      const maxY = Math.max(0, window.innerHeight - buttonHeight);
      
      if (noButtonPosition.x > maxX) {
        setNoButtonPosition(prev => ({ ...prev, x: maxX }));
      }
      if (noButtonPosition.y > maxY) {
        setNoButtonPosition(prev => ({ ...prev, y: maxY }));
      }
      if (noButtonPosition.x < 0) {
        setNoButtonPosition(prev => ({ ...prev, x: 0 }));
      }
      if (noButtonPosition.y < 0) {
        setNoButtonPosition(prev => ({ ...prev, y: 0 }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noButtonPosition]);

  if (showSweetMessage) {
    console.log('Showing sweet message, showSweetMessage:', showSweetMessage);
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 relative overflow-hidden">
        {/* Simple background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-rose-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-100 rounded-full opacity-30"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-lg mx-auto">
            {/* Success GIF */}
            <div className="mb-6 flex justify-center">
              <Image 
                src={loveHeartGif} 
                alt="Love Heart GIF" 
                width={320}
                height={160}
                className="rounded-lg shadow-md"
              />
            </div>
            
            {/* Success message */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">💖</div>
              <h1 className="text-xl font-semibold text-gray-800 mb-3">
                {currentQuestion === 0 ? sweetMessages[0] : `You finally said Yes! 💕 I love you too! ✨`}
              </h1>
              <div className="text-sm text-gray-600">
                Your love makes my heart skip a beat! 💓
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalMessage) {
    console.log('Showing final message, showFinalMessage:', showFinalMessage);
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 relative overflow-hidden">
        {/* Simple background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-rose-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-100 rounded-full opacity-30"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-lg mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">😸</div>
              <h1 className="text-lg font-semibold text-gray-800 mb-3">
                {finalMessage}
              </h1>
              <div className="text-sm text-gray-600">
                You&apos;re adorable even when you&apos;re stubborn! 🥰
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we should show the moving No button
  const shouldShowMovingButton = currentQuestion >= questions.length - 1;

  console.log('Current state - showSweetMessage:', showSweetMessage, 'showFinalMessage:', showFinalMessage, 'currentQuestion:', currentQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 relative overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-rose-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-100 rounded-full opacity-30"></div>
      </div>

      {/* Minimal floating elements */}
      <div className="fixed top-16 left-16 text-2xl animate-float">🎈</div>
      <div className="fixed top-32 right-24 text-3xl animate-pulse-slow">🎀</div>
      <div className="fixed bottom-24 left-20 text-2xl animate-spin-slow">💫</div>
      <div className="fixed bottom-16 right-16 text-3xl animate-float">🦋</div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-lg mx-auto">
          {/* Main content card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* GIF above the question */}
            {currentGif && (
              <div className="mb-6 flex justify-center">
                <Image 
                  src={currentGif} 
                  alt="Question GIF" 
                  width={320}
                  height={128}
                  className="rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Question */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
              {questions[currentQuestion]}
            </h1>

            {/* Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleYes}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-500 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-sm"
              >
                Yes! 💖
              </button>
              
              {shouldShowMovingButton ? (
                // Moving No button (after all questions are exhausted)
                <button
                  onClick={handleNo}
                  onMouseEnter={!isMobile ? moveNoButton : undefined}
                  onTouchStart={isMobile ? moveNoButton : undefined}
                  style={{
                    position: isMobile ? 'relative' : 'fixed',
                    left: isMobile ? 'auto' : `${noButtonPosition.x}px`,
                    top: isMobile ? 'auto' : `${noButtonPosition.y}px`,
                    zIndex: isMobile ? 10 : 50,
                    transition: 'all 0.3s ease',
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? 'none' : '200px'
                  }}
                  className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-rose-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-sm"
                >
                  No 😢
                </button>
              ) : (
                // Static No button (for first 7 attempts)
                <button
                  onClick={handleNo}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-rose-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-sm"
                >
                  No 😢
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
