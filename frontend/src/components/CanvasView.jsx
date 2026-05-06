import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Text, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useCardStore } from '../store';

const VisitingCard = () => {
  const meshRef = useRef();
  const { cardData } = useCardStore();

  // Smooth hover tilt effect based on mouse position
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle floating
      meshRef.current.position.y = Math.sin(t) * 0.1;
      
      // Interactive tilt mapping mouse to rotation
      const targetRotationX = (state.mouse.y * Math.PI) / 8;
      const targetRotationY = (state.mouse.x * Math.PI) / 8;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.1);
    }
  });

  const getMaterial = () => {
    if (cardData.style === 'glass') {
      return (
        <MeshTransmissionMaterial 
          thickness={0.2} 
          roughness={0.1} 
          transmission={0.9} 
          ior={1.5} 
          chromaticAberration={0.05} 
          backside 
          color={cardData.color1}
        />
      );
    } else if (cardData.style === 'neon') {
      return (
        <meshStandardMaterial 
          color={cardData.color1} 
          emissive={cardData.color2} 
          emissiveIntensity={2} 
          roughness={0.2}
          metalness={0.8}
        />
      );
    } else if (cardData.style === 'holographic') {
      return (
        <meshPhysicalMaterial 
          color={cardData.color1} 
          roughness={0.1}
          metalness={0.5}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
        />
      );
    } else if (cardData.style === 'metallic') {
      return (
        <meshStandardMaterial 
          color={cardData.color1} 
          roughness={0.2} 
          metalness={1.0}
        />
      );
    } else if (cardData.style === 'wireframe') {
      return (
        <meshStandardMaterial 
          color={cardData.color1} 
          wireframe={true}
        />
      );
    } else {
      // Minimal Matte
      return (
        <meshStandardMaterial 
          color={cardData.color1} 
          roughness={0.9} 
          metalness={0.1}
        />
      );
    }
  };

  const visible = cardData.visibleFields || {};
  const leftInfo = [];
  const rightInfo = [];

  const truncate = (str, maxLen = 18) => str.length > maxLen ? str.slice(0, maxLen) + '...' : str;

  if (visible.phone && cardData.phone) leftInfo.push(truncate(cardData.phone));
  if (visible.email && cardData.email) leftInfo.push(truncate(cardData.email));
  if (visible.location && cardData.location) rightInfo.push(truncate(cardData.location));
  if (visible.website && cardData.website) rightInfo.push(truncate(cardData.website));
  if (visible.linkedin && cardData.linkedin) rightInfo.push(truncate(cardData.linkedin));
  if (visible.twitter && cardData.twitter) rightInfo.push(truncate(cardData.twitter));

  const leftStartY = -0.5;
  const rightStartY = -0.5;
  const lineGap = 0.15;

  return (
    <group ref={meshRef}>
      {/* The Physical Card */}
      <RoundedBox args={[3.5, 2, 0.05]} radius={0.05} smoothness={4} castShadow receiveShadow>
        {getMaterial()}
      </RoundedBox>

      {/* Front Face Content */}
      <group position={[0, 0, 0.031]}>
        {/* Name */}
        <Text
          font={cardData.font}
          position={[-1.5, 0.75, 0]}
          fontSize={0.18}
          color={cardData.textColor || '#ffffff'}
          anchorX="left"
          anchorY="middle"
          fontWeight="bold"
        >
          {cardData.name}
        </Text>

        {/* Tagline */}
        {visible.tagline && cardData.tagline && (
          <Text
            font={cardData.font}
            position={[-1.5, 0.52, 0]}
            fontSize={0.06}
            color={cardData.textColor || '#ffffff'}
            anchorX="left"
            anchorY="middle"
          >
            {cardData.tagline}
          </Text>
        )}

        {/* Designation */}
        <Text
          font={cardData.font}
          position={[-1.5, 0.28, 0]}
          fontSize={0.09}
          color={cardData.style === 'neon' ? '#ffffff' : cardData.color2}
          anchorX="left"
          anchorY="middle"
        >
          {cardData.designation}
        </Text>

        {/* Company Logo/Name (Right side) */}
        <Text
          font={cardData.font}
          position={[1.5, 0.6, 0]}
          fontSize={0.14}
          color={cardData.textColor || '#ffffff'}
          anchorX="right"
          anchorY="middle"
        >
          {cardData.company}
        </Text>

        {/* Contact Info (Bottom) */}
        {leftInfo.map((text, index) => (
          <Text
            key={`left-info-${index}`}
            font={cardData.font}
            position={[-1.5, leftStartY - index * lineGap, 0]}
            fontSize={0.055}
            color={cardData.textColor || '#ffffff'}
            anchorX="left"
            anchorY="middle"
          >
            {text}
          </Text>
        ))}

        {rightInfo.map((text, index) => (
          <Text
            key={`right-info-${index}`}
            font={cardData.font}
            position={[1.5, rightStartY - index * lineGap, 0]}
            fontSize={0.055}
            color={cardData.textColor || '#ffffff'}
            anchorX="right"
            anchorY="middle"
          >
            {text}
          </Text>
        ))}
      </group>

      {/* Back Face Content (Flipped) */}
      <group position={[0, 0, -0.031]} rotation={[0, Math.PI, 0]}>
        <Text
          font={cardData.font}
          position={[0, 0, 0]}
          fontSize={0.28}
          color={cardData.textColor || '#ffffff'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {cardData.company}
        </Text>
      </group>
    </group>
  );
};

const CanvasView = () => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
      {/* Vibrant dark background matching the UI */}
      <color attach="background" args={['#020617']} />
      
      {/* Lights for the neon/glass effects */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={3} 
        maxDistance={8}
      />

      <VisitingCard />

      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#000000" />
      <Environment preset="city" />
    </Canvas>
  );
};

export default CanvasView;
