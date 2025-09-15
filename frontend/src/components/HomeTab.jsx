// src/HomeTab.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fallbackQuotes = [
  { quote: "We should keep our city clean.", author: "— Nagar Seva" },
  { quote: "A clean city is a healthy city.", author: "— Civic Wisdom" },
  { quote: "Be the change you want to see.", author: "— Mahatma Gandhi" },
  { quote: "Every small step makes a big difference.", author: "— Nagar Seva" }
];

export default function HomeTab({ setIsFormOpen }) {
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const results = await Promise.all(
          Array.from({ length: 4 }).map(() =>
            fetch("https://fixitnoww-production.up.railway.app/api/quotes/random").then((res) =>
              res.json()
            )
          )
        );
        setQuotes(results);
      } catch {
        setQuotes(fallbackQuotes);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) =>
        quotes.length ? (prev + 1) % quotes.length : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes]);

  const currentQuote = quotes[currentQuoteIndex] || {};

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6 md:p-12 text-center relative">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-56 h-56 bg-violet-200/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-32 -left-32 w-56 h-56 bg-purple-200/20 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
 leading-tight mb-10"
          >
            Welcome to Nagar Seva
          </motion.h1>

          <div className="h-20 md:h-24 mb-6 flex items-center justify-center">
            {loading ? (
              <p className="text-violet-600 italic">Loading quotes...</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg md:text-xl italic text-gray-700 mb-1"
                >
                  “{currentQuote.quote}”
                  {currentQuote.author && (
                    <div className="mt-1 text-sm text-violet-600">
                      {currentQuote.author.name || currentQuote.author}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 mb-8"
          >
            Report civic issues and track their resolution in seconds. Make your city
            cleaner and safer by raising complaints about potholes, streetlights,
            water issues, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <button
              onClick={() => (window.location.href = "/complaint-form")}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-violet-700 hover:to-purple-700 transition transform hover:scale-105 font-semibold"
            >
              Raise a Complaint
            </button>
            <button className="px-6 py-3 bg-white text-violet-600 border-2 border-violet-200 rounded-lg shadow hover:bg-violet-50 transition font-semibold">
              Browse Issues
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { icon: "⚡", title: "Quick Reporting" },
              { icon: "📊", title: "Track Progress" },
              { icon: "🌟", title: "Make Impact" }
            ].map((f, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100
rounded-xl p-6 text-center 
shadow-md hover:shadow-xl hover:scale-105 
transition-transform duration-300
"

              >
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-gray-800">{f.title}</h3>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
