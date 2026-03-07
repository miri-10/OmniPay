'use client';

import { useEffect, useRef, useCallback } from 'react';

type ShapeType = 'cube' | 'tetrahedron' | 'octahedron' | 'icosahedron';

interface FloatingObject {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
  size: number;
  color: string;
  opacity: number;
  shape: ShapeType;
  floatOffset: number;
  floatSpeed: number;
  floatPhase: number;
}

const colors = [
  '#a855f7',
  '#d946ef',
  '#8b5cf6',
  '#6366f1',
  '#c084fc',
  '#e879f9',
];

const shapes: ShapeType[] = ['cube', 'tetrahedron', 'octahedron', 'icosahedron'];

const ThreeDParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const objectsRef = useRef<FloatingObject[]>([]);
  const animationRef = useRef<number>(0);

  const initObjects = useCallback((width: number, height: number) => {
    const objects: FloatingObject[] = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      objects.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        vz: (Math.random() - 0.5) * 0.3,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeedX: (Math.random() - 0.5) * 0.01,
        rotationSpeedY: (Math.random() - 0.5) * 0.01,
        rotationSpeedZ: (Math.random() - 0.5) * 0.01,
        size: Math.random() * 25 + 15,
        color,
        opacity: Math.random() * 0.4 + 0.3,
        shape,
        floatOffset: Math.random() * 30 + 10,
        floatSpeed: Math.random() * 0.001 + 0.0005,
        floatPhase: Math.random() * Math.PI * 2,
      });
    }
    objectsRef.current = objects;
  }, []);

  const project = (x: number, y: number, z: number, width: number, height: number, perspective: number) => {
    const scale = perspective / (perspective + z);
    const x2d = width / 2 + x * scale;
    const y2d = height / 2 + y * scale;
    return { x: x2d, y: y2d, scale };
  };

  const drawCube = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotationX: number, rotationY: number, opacity: number, color: string) => {
    const vertices = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];

    const rotated = vertices.map(v => {
      let { x: rx, y: ry, z: rz } = v;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      
      rx = rx * cosY - rz * sinY;
      rz = rz * cosY + rx * sinY;
      ry = ry * cosX - rz * sinX;
      rz = rz * cosX + ry * sinX;
      
      return { x: rx * size, y: ry * size, z: rz * size };
    });

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = opacity;

    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(x + rotated[i].x, y + rotated[i].y);
      ctx.lineTo(x + rotated[j].x, y + rotated[j].y);
      ctx.stroke();
    });

    ctx.globalAlpha = opacity * 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + rotated[0].x, y + rotated[0].y);
    for (let i = 1; i < 4; i++) {
      ctx.lineTo(x + rotated[i].x, y + rotated[i].y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = opacity;
  };

  const drawTetrahedron = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotationX: number, rotationY: number, opacity: number, color: string) => {
    const vertices = [
      { x: 0, y: -1, z: 0 },
      { x: 0.943, y: 0.333, z: 0 },
      { x: -0.471, y: 0.333, z: 0.816 },
      { x: -0.471, y: 0.333, z: -0.816 },
    ];

    const rotated = vertices.map(v => {
      let { x: rx, y: ry, z: rz } = v;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      
      rx = rx * cosY - rz * sinY;
      rz = rz * cosY + rx * sinY;
      ry = ry * cosX - rz * sinX;
      rz = rz * cosX + ry * sinX;
      
      return { x: rx * size, y: ry * size, z: rz * size };
    });

    const edges = [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [2, 3], [3, 1],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = opacity;

    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(x + rotated[i].x, y + rotated[i].y);
      ctx.lineTo(x + rotated[j].x, y + rotated[j].y);
      ctx.stroke();
    });

    ctx.globalAlpha = opacity * 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + rotated[0].x, y + rotated[0].y);
    ctx.lineTo(x + rotated[1].x, y + rotated[1].y);
    ctx.lineTo(x + rotated[2].x, y + rotated[2].y);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = opacity;
  };

  const drawOctahedron = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotationX: number, rotationY: number, opacity: number, color: string) => {
    const s = 0.8;
    const vertices = [
      { x: 0, y: -s, z: 0 },
      { x: s, y: 0, z: 0 },
      { x: 0, y: 0, z: s },
      { x: -s, y: 0, z: 0 },
      { x: 0, y: 0, z: -s },
      { x: 0, y: s, z: 0 },
    ];

    const rotated = vertices.map(v => {
      let { x: rx, y: ry, z: rz } = v;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      
      rx = rx * cosY - rz * sinY;
      rz = rz * cosY + rx * sinY;
      ry = ry * cosX - rz * sinX;
      rz = rz * cosX + ry * sinX;
      
      return { x: rx * size, y: ry * size, z: rz * size };
    });

    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = opacity;

    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(x + rotated[i].x, y + rotated[i].y);
      ctx.lineTo(x + rotated[j].x, y + rotated[j].y);
      ctx.stroke();
    });

    ctx.globalAlpha = opacity * 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + rotated[0].x, y + rotated[0].y);
    for (let i = 1; i < 4; i++) {
      ctx.lineTo(x + rotated[i].x, y + rotated[i].y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = opacity;
  };

  const drawIcosahedron = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotationX: number, rotationY: number, opacity: number, color: string) => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const s = 0.6;
    const vertices = [
      { x: -1, y: phi, z: 0 },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 0, y: 1, z: -phi },
      { x: phi, y: 0, z: -1 },
      { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
    ];

    const rotated = vertices.map(v => {
      let { x: rx, y: ry, z: rz } = v;
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      
      rx = rx * cosY - rz * sinY;
      rz = rz * cosY + rx * sinY;
      ry = ry * cosX - rz * sinX;
      rz = rz * cosX + ry * sinX;
      
      return { x: rx * size, y: ry * size, z: rz * size };
    });

    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
      [4, 11], [2, 10], [6, 7], [8, 1], [9, 5],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = opacity;

    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(x + rotated[i].x, y + rotated[i].y);
      ctx.lineTo(x + rotated[j].x, y + rotated[j].y);
      ctx.stroke();
    });

    ctx.globalAlpha = opacity * 0.12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + rotated[0].x, y + rotated[0].y);
    for (let i = 1; i < 5; i++) {
      ctx.lineTo(x + rotated[i].x, y + rotated[i].y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = opacity;
  };

  const drawShape = (ctx: CanvasRenderingContext2D, obj: FloatingObject, x: number, y: number, scale: number) => {
    const size = obj.size * scale;
    
    ctx.save();
    ctx.translate(x, y);
    
    switch (obj.shape) {
      case 'cube':
        drawCube(ctx, 0, 0, size, obj.rotationX, obj.rotationY, obj.opacity * scale, obj.color);
        break;
      case 'tetrahedron':
        drawTetrahedron(ctx, 0, 0, size, obj.rotationX, obj.rotationY, obj.opacity * scale, obj.color);
        break;
      case 'octahedron':
        drawOctahedron(ctx, 0, 0, size, obj.rotationX, obj.rotationY, obj.opacity * scale, obj.color);
        break;
      case 'icosahedron':
        drawIcosahedron(ctx, 0, 0, size, obj.rotationX, obj.rotationY, obj.opacity * scale, obj.color);
        break;
    }
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initObjects(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const perspective = 800;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now();

      const mouseInfluence = {
        x: (mouseRef.current.x - centerX) * 0.03,
        y: (mouseRef.current.y - centerY) * 0.03,
      };

      const sortedObjects = [...objectsRef.current].sort((a, b) => b.z - a.z);

      sortedObjects.forEach((obj) => {
        obj.x += obj.vx + mouseInfluence.x * 0.02;
        obj.y += obj.vy + mouseInfluence.y * 0.02 + Math.sin(time * obj.floatSpeed + obj.floatPhase) * obj.floatSpeed * 100;
        obj.z += obj.vz;

        obj.rotationX += obj.rotationSpeedX;
        obj.rotationY += obj.rotationSpeedY;
        obj.rotationZ += obj.rotationSpeedZ;

        const boundsX = canvas.width * 0.8;
        const boundsY = canvas.height * 0.8;
        
        if (obj.x < -boundsX) obj.x = boundsX;
        if (obj.x > boundsX) obj.x = -boundsX;
        if (obj.y < -boundsY) obj.y = boundsY;
        if (obj.y > boundsY) obj.y = -boundsY;
        if (obj.z < 100) obj.z = 900;
        if (obj.z > 1000) obj.z = 100;

        const projected = project(obj.x, obj.y, obj.z, canvas.width, canvas.height, perspective);
        const scale = projected.scale;

        if (scale > 0.1) {
          drawShape(ctx, obj, projected.x, projected.y, scale);
        }

        objectsRef.current.forEach((other) => {
          if (other === obj) return;
          
          const dx = obj.x - other.x;
          const dy = obj.y - other.y;
          const dz = obj.z - other.z;
          const dist3d = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.1);
          
          if (dist3d < 150) {
            const otherProjected = project(other.x, other.y, other.z, canvas.width, canvas.height, perspective);
            const lineOpacity = (1 - dist3d / 150) * 0.08 * scale * otherProjected.scale;
            
            ctx.beginPath();
            ctx.moveTo(projected.x, projected.y);
            ctx.lineTo(otherProjected.x, otherProjected.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      const horizonY = canvas.height * 0.75;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.03)';
      ctx.lineWidth = 1;

      for (let i = -15; i <= 15; i++) {
        const xBottom = centerX + i * 50;
        const xTop = centerX + i * 12;
        ctx.beginPath();
        ctx.moveTo(xTop, horizonY);
        ctx.lineTo(xBottom, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        const y = horizonY + Math.pow(i / 8, 2) * (canvas.height - horizonY);
        const spread = (i / 8) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(centerX - spread, y);
        ctx.lineTo(centerX + spread, y);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initObjects]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <div className="purple-glow" />
    </>
  );
};

export default ThreeDParticleBackground;
