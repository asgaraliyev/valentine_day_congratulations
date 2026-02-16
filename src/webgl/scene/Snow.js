const THREE = require('three');
const animate = require('@jam3/gsap-promise');

module.exports = class Snow extends THREE.Object3D {
  constructor(count = 25000) {
    super();
    
    // Move snow in front of camera
    this.position.z = 10; // Moved closer to camera
    
    // Create geometry for snowflakes
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];
    this.particles = [];

    // Create snowflakes with random positions
    for (let i = 0; i < count; i++) {
      // Random position in a wider area
      const x = Math.random() * 100 - 50;  // Tighter spread for more density
      const y = Math.random() * 100 - 25;  // Higher spawn
      const z = Math.random() * 20 - 10;   // Less depth for better visibility

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Even slower, more gentle falling speed
      velocities.push(
        Math.random() * 0.02 - 0.01,    // Very gentle x drift
        -Math.random() * 0.05 - 0.02,   // Very slow downward motion
        Math.random() * 0.02 - 0.01     // Very gentle z drift
      );

      this.particles.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(velocities[i * 3], velocities[i * 3 + 1], velocities[i * 3 + 2]),
        initialY: y,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0005, // Even slower rotation
        wobbleSpeed: 0.05 + Math.random() * 0.1,      // Very gentle wobble
        wobbleAmount: 0.03 + Math.random() * 0.05     // Smaller wobble amount
      });
    }

    // Add position attribute using older API
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create material for snowflakes
    const material = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.2, // Larger flakes for better visibility
      transparent: true,
      opacity: 0,
      map: this.createSnowflakeTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Create the particle system
    this.particleSystem = new THREE.Points(geometry, material);
    this.add(this.particleSystem);

    // Start updating immediately
    this.isAnimating = true;
  }

  createSnowflakeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw a brighter, more visible snow particle
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)'); // More visible fade
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  update(dt = 0, time = 0) {
    if (!this.isAnimating) return;

    const positions = this.particleSystem.geometry.attributes.position.array;

    // Update each particle
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      
      // Add wobble motion
      particle.angle += particle.rotationSpeed;
      const wobble = Math.sin(time * particle.wobbleSpeed + particle.angle) * particle.wobbleAmount;
      
      // Update position with velocity and wobble
      particle.position.x += particle.velocity.x + wobble;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;

      // Reset particle if it goes too low
      if (particle.position.y < -25) {
        particle.position.y = 75;  // Reset higher
        particle.position.x = Math.random() * 100 - 50;
        particle.position.z = Math.random() * 20 - 10;
      }

      // Update the geometry
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  animateIn() {
    this.isAnimating = true;
    animate.to(this.particleSystem.material, 4.0, { // Even longer fade in
      opacity: 1.0, // Full opacity for better visibility
      ease: Expo.easeOut
    });
  }

  animateOut() {
    animate.to(this.particleSystem.material, 1.0, {
      opacity: 0,
      ease: Expo.easeOut,
      onComplete: () => {
        this.isAnimating = false;
      }
    });
  }
}; 