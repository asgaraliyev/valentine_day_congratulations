const animate = require('@jam3/gsap-promise');
const { assets } = require('../../context');

// Load THREE.js
const THREE = require('three');

// Function to get a random integer in a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Load ball textures with proper settings
const ballTextures = [];
const textureLoader = new THREE.TextureLoader();
for (let i = 1; i <= 3; i++) {
  const texture = textureLoader.load(`assets/images/balls/${i}.jpg`);

  // Adjust texture settings
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter; // Better for scaling
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true; // Enable mipmaps for smoother textures
  texture.encoding = THREE.LinearEncoding; // Fix brightness issue

  ballTextures.push(texture);
}

// Define the TriangleFetti class
module.exports = class TriangleFetti extends THREE.Object3D {
  constructor() {
    super();
    this.generateFetti(100);
    // Store initial positions for animation
    this.initialPositions = this.children.map(child => ({
      x: child.position.x,
      y: child.position.y,
      z: child.position.z,
      phase: Math.random() * Math.PI * 2, // Random starting phase
      speed: 0.2 + Math.random() * 0.3,   // Random speed
      radius: Math.random() * 2           // Random movement radius
    }));
  }

  generateFetti = (count) => {
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.CircleGeometry(0.5, 32);
      const material = new THREE.MeshStandardMaterial({
        map: ballTextures[Math.floor(Math.random() * ballTextures.length)],
        roughness: 0.8, // Reduces reflectiveness
        metalness: 0.1, // Slight metallic look
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Enable shadows for more realistic depth
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Wider distribution
      const spread = 30;
      const heartZ = -3;

      // Generate positions with better distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * spread;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius;

      // Position circles in layers
      const minZ = heartZ + 0.5; // Closer to heart
      const maxZ = heartZ + 8; // Further out
      mesh.position.z = minZ + Math.random() * (maxZ - minZ);

      // Avoid immediate center area
      const distanceFromCenter = Math.sqrt(mesh.position.x ** 2 + mesh.position.y ** 2);
      if (distanceFromCenter < 3) {
        mesh.position.x *= 3 / distanceFromCenter;
        mesh.position.y *= 3 / distanceFromCenter;
      }

      // Varied size range
      const scale = (Math.random() * (1.0 - 0.2) + 0.2);
      mesh.scale.set(scale, scale, scale);

      this.add(mesh);
    }
  }

  animateIn() {
    animate.fromTo(this.position, 5.0, {
      x: -30,
      y: -30,
      z: -30
    }, {
      x: 0,
      y: 0,
      z: 0,
      ease: Back.easeOut,
      delay: 0.5
    });

    animate.fromTo(this.rotation, 15.0, {
      x: 15 * THREE.Math.DEG2RAD,
      y: 40 * THREE.Math.DEG2RAD,
      z: 25 * THREE.Math.DEG2RAD,
    }, {
      x: 0,
      y: 0,
      z: 0,
      ease: Expo.easeOut,
      delay: 0.5
    });
  }

  update(dt = 0) {
    if (this.children) {
      for (let j = 0; j < this.children.length; j++) {
        const circle = this.children[j];
        const initialPos = this.initialPositions[j];
        
        // Make circles always face the camera
        circle.lookAt(0, 0, 5);
        
        // Calculate new position
        const time = Date.now() * 0.001; // Convert to seconds
        
        // Create floating motion
        circle.position.x = initialPos.x + Math.sin(time * initialPos.speed + initialPos.phase) * initialPos.radius;
        circle.position.y = initialPos.y + Math.cos(time * initialPos.speed + initialPos.phase) * initialPos.radius;
        circle.position.z = initialPos.z + Math.sin(time * initialPos.speed * 0.5) * 0.5;
        
        // Add a gentle rotation
        circle.rotation.z += dt * 0.1;
      }
    }
  }
};
