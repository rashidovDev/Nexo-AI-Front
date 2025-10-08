"use client"
import React, { use, useState } from 'react'
import { LuMessagesSquare } from "react-icons/lu";

import ModeToggle from '@/components/ui/custom/mode-toggle';
import { motion ,  AnimatePresence} from "framer-motion";

const Page = () => {
      const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Animation variants
  const chatVariants = {
    open: { x: -320, transition: { type: "tween", duration: 0.3 } }, // chat slides left
    closed: { x: 0, transition: { type: "tween", duration: 0.3 } },
  };

  const profileVariants = {
    open: { x: 0, transition: { type: "tween", duration: 0.3 } }, // profile slides in
    closed: { x: 320, transition: { type: "tween", duration: 0.3 } },
  };
  return (
   <div className="relative h-screen flex bg-gray-100 font-sans overflow-hidden">
      {/* Chat Page */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Chat Page</h1>
        <div
          className="p-4 bg-white rounded shadow cursor-pointer w-48"
          onClick={() => setIsProfileOpen(true)}
        >
          Open Profile
        </div>
      </div>

      {/* AnimatePresence for smooth mount/unmount */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
            ></motion.div>

            {/* Profile Panel */}
            <motion.div
              className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Profile</h2>
                <button
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={() => setIsProfileOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* Profile Content */}
              <div className="p-6 flex flex-col items-center space-y-4 overflow-y-auto flex-1">
                <img
                  src="https://i.pravatar.cc/100?img=3"
                  alt="User"
                  className="w-24 h-24 rounded-full shadow-lg"
                />
                <h3 className="text-lg font-semibold">John Doe</h3>
                <p className="text-gray-500">@johndoe</p>
                <p className="text-center text-gray-600">
                  Bio: Loves coding, coffee ☕, and exploring new tech!
                </p>

                <div className="w-full space-y-3 mt-4">
                  <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Message
                  </button>
                  <button className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                    Call
                  </button>
                  <button className="w-full py-2 px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition">
                    Block
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Page 