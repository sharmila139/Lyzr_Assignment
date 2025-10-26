'use client';

import { motion } from 'framer-motion';
import { BarChart3, Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header({ onCreatePollClick }: { onCreatePollClick: () => void }) {
  return (
    <motion.header 
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-32 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-16 h-16 bg-white/8 rounded-full blur-lg"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Main title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-1">
              <span className="gradient-text bg-gradient-to-r from-white-10 to-yellow-80">
                QuickPoll
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Real-time opinion polling platform with live updates 
            and instant results. Create polls, vote, and watch results update in real-time!
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              className="flex flex-col items-center text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">Live Results</h3>
              <p className="text-blue-200 text-sm">Real-time updates</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">Instant</h3>
              <p className="text-blue-200 text-sm">Fast & responsive</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">Interactive</h3>
              <p className="text-blue-200 text-sm">Engage & participate</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">Analytics</h3>
              <p className="text-blue-200 text-sm">Track trends</p>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          {/*<motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-full shadow-lg hover-lift"
              onClick={() =>
                document
                  .getElementById('polls-section')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Polls
            </Button>
            <Button
              size="lg"
              className="bg-blue-500 text-white hover:bg-blue-600 text-lg px-8 py-4 rounded-full shadow-lg hover-lift"
              onClick={onCreatePollClick}
            >
              Create Polls
            </Button>
          </motion.div>*/}
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-16"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </motion.header>
  );
}
