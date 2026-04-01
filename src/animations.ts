import gsap from 'gsap';

export function initBackgroundAnimation() {
  const container = document.getElementById('animated-bg');
  if (!container) return;

  // Create gradient blobs
  const blob1 = document.createElement('div');
  blob1.className = 'gradient-blob blob-1';

  const blob2 = document.createElement('div');
  blob2.className = 'gradient-blob blob-2';

  const blob3 = document.createElement('div');
  blob3.className = 'gradient-blob blob-3';

  container.appendChild(blob1);
  container.appendChild(blob2);
  container.appendChild(blob3);

  // Animate blob 1 - floating around
  gsap.to(blob1, {
    x: 200,
    y: 150,
    scale: 1.2,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Animate blob 2 - circular motion
  gsap.to(blob2, {
    x: -150,
    y: -100,
    scale: 0.9,
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Animate blob 3 - slow rotation and pulse
  gsap.to(blob3, {
    x: 100,
    y: -80,
    scale: 1.1,
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Create floating shapes
  const shapes = [];
  for (let i = 0; i < 15; i++) {
    const shape = document.createElement('div');
    const isCircle = Math.random() > 0.5;
    shape.className = `floating-shape ${isCircle ? 'circle' : 'square'}`;

    const size = Math.random() * 60 + 20;
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.top = `${Math.random() * 100}%`;

    container.appendChild(shape);
    shapes.push(shape);

    // Animate each shape
    gsap.to(shape, {
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      rotation: isCircle ? 0 : Math.random() * 360,
      duration: Math.random() * 10 + 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random() * 2,
    });

    // Opacity pulse
    gsap.to(shape, {
      opacity: Math.random() * 0.3 + 0.05,
      duration: Math.random() * 3 + 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // Add a subtle rotation to the entire background
  gsap.to(container, {
    rotation: 5,
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}
