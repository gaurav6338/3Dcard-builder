import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, RoundedBox, MeshTransmissionMaterial, Float } from '@react-three/drei';
import { Hexagon, ArrowRight, Sparkles, Layers } from 'lucide-react';

// A lightweight, spinning 3D card just for the landing page hero
const HeroCard = () => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <RoundedBox ref={meshRef} args={[3.5, 2, 0.1]} radius={0.05} smoothness={4}>
        <MeshTransmissionMaterial 
          thickness={0.5} 
          roughness={0.1} 
          transmission={1} 
          ior={1.5} 
          chromaticAberration={0.1} 
          color="#3b82f6" 
        />
      </RoundedBox>
    </Float>
  );
};

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-73px)] overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left: Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium text-sm backdrop-blur-md"
          >
            <Sparkles size={16} className="text-yellow-400" />
            The Ultimate 3D Experience
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.1]"
          >
            Design Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Identity.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0"
          >
            Create breathtaking, interactive 3D visiting cards that leave a lasting impression. Customize materials, fonts, and colors with our state-of-the-art WebGL builder, then save and reload instantly from the cloud.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4"
          >
            <Link 
              to="/build" 
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-2"
            >
              Start Building <ArrowRight size={20} />
            </Link>
            <Link 
              to="/pricing" 
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Layers size={20} /> View Pricing
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 grid gap-3 sm:grid-cols-3 text-sm text-slate-300"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Instant cloud reload</p>
              <p className="mt-2 text-slate-400">Login once and restore your latest design anywhere.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Shareable live links</p>
              <p className="mt-2 text-slate-400">Export a cloud-hosted card that anyone can preview.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Auto-save workflow</p>
              <p className="mt-2 text-slate-400">Your progress stays synced as you design.</p>
            </div>
          </motion.div>
        </div>

        {/* Right: 3D Hero Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 w-full h-[500px] lg:h-[600px] relative"
        >
          {/* Glowing pedestal effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[100px] -z-10" />
          
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
            <HeroCard />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </motion.div>

      </div>
    </div>
  );
};

export default Home;
