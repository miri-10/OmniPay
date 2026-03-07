'use client';

import { useEffect, useRef, useCallback } from 'react';

type ShapeType = 'cube' | 'sphere' | 'torus' | 'pyramid' | 'diamond';

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
  '#f0abfc',
];

const shapes: ShapeType[] = ['cube', 'sphere', 'torus', 'pyramid', 'diamond'];

const FloatingObjects3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const objectsRef = useRef<FloatingObject[]>([]);
  const animationRef = useRef<number>(0);

  const initObjects = useCallback((width: number, height: number) => {
    const objects: FloatingObject[] = [];
    const count = 25;

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      objects.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 1000 + 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.15,
        vz: (Math.random() - 0.5) * 0.2,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        rotationSpeedX: (Math.random() - 0.5) * 0.008,
        rotationSpeedY: (Math.random() - 0.5) * 0.008,
        rotationSpeedZ: (Math.random() - 0.5) * 0.008,
        size: Math.random() * 30 + 20,
        color,
        opacity: Math.random() * 0.5 + 0.3,
        shape,
        floatOffset: Math.random() * 40 + 15,
        floatSpeed: Math.random() * 0.0008 + 0.0004,
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
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 },
    ];

    const rotated = vertices.map(v => {
      let { x: rx, y: ry, z: rz } = v;
      const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
      
      const tempX = rx * cosY - rz * sinY;
      rz = rz * cosY + rx * sinY;
      rx = tempX;
      
      const tempY = ry * cosX - rz * sinX;
      rz = rz * cosX + ry * sinX;
      ry = tempY;
      
      return { x: rx * size, y: ry * size, z: rz * size };
    });

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity;

    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(x + rotated[i].x, y + rotated[i].y);
      ctx.lineTo(x + rotated[j].x, y + rotated[j].y);
      ctx.stroke();
    });

    ctx.globalAlpha = opacity * 0.2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + rotated[0].x, y + rotated[0].y);
    for (let i = 1; i < 4; i++) {
      ctx.lineTo(x + rotated[i].x, y + rotated[i].y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
  };

  const drawSphere = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, color: string) => {
    const gradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.globalAlpha = opacity * 0.6;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  const drawTorus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotationX: number, opacity: number, color: string) => {
    const outerRadius = size;
    const innerRadius = size * 0.5;
    
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const rx = Math.cos(angle) * outerRadius;
      const ry = Math.sin(angle) * outerRadius * Math.cos(rotationX);
      
      ctx.beginPath();
      ctx.arc(x + rx, y + ry, innerRadius * Math.abs(Math.cos(rotationX)), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };

  const drawPyramid = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotationX: number, rotationY: number, opacity: number, color: string) => {
    const vertices = [
      { x: 0, y: -1.2, z: 0 },
      { x: 1, y: 0.4, z: 1 },
      { x: -1, y: 0.4, z: 1 },
      { x: -1, y: 0.4, z: -1 },
      { x: 1, y: 0.4, z: -1 },
    ];

    const rotated = vertices.map(v => {
      let { x: rx, y: ry, z: rz } = v;
      const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
      
      const tempX = rx * cosY - rz * sinY;
      rz = rz * cosY + rx * sinY;
      rx = tempX;
      
      const tempY = ry * cosX - rz * sinX;
      rz = rz * cosX + ry * sinX;
      ry = tempY;
      
      return { x: rx * size, y: ry * size, z: rz * size };
    });

    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity;

    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(x + rotated[i].x, y + rotated[i].y);
      ctx.lineTo(x + rotated[j].x, y + rotated[j].y);
      ctx.stroke();
    });

    ctx.globalAlpha = opacity * 0.2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + rotated[0].x, y + rotated[0].y);
    ctx.lineTo(x + rotated[1].x, y + rotated[1].y);
    ctx.lineTo(x + rotated[2].x, y + rotated[2].y);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotationX: number, rotationY: number, opacity: number, color: string) => {
    const vertices = [
      { x: 0, y: -1.5, z: 0 },
      { x: 0.8, y: 0, z: 0.8 },
      { x: -0.8, y: 0, z: 0.8 },
      { x: -0.8, y: 0, z: -0.8 },
      { x: 0.8, y: 0, z: -0.8 },
      { x: 0, y: 1.5, z: 0 },
    ];

    const rotated = vertices.map(v => {
      let { x: rx, y: ry, z: rz } = v;
      const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
      
      const tempX = rx * cosY - rz * sinY;
      rz = rz * cosY + rx * sinY;
      rx = tempX;
      
      const tempY = ry * cosX - rz * sinX;
      rz = rz * cosX + ry * sinX;
      ry = tempY;
      
      return { x: rx * size, y: ry * size, z: rz * size };
    });

    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity;

    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(x + rotated[i].x, y + rotated[i].y);
      ctx.lineTo(x + rotated[j].x, y + rotated[j].y);
      ctx.stroke();
    });

    ctx.globalAlpha = opacity * 0.25;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + rotated[0].x, y + rotated[0].y);
    ctx.lineTo(x + rotated[1].x, y + rotated[1].y);
    ctx.lineTo(x + rotated[2].x, y + rotated[2].y);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
  };

  const drawShape = (ctx: CanvasRenderingContext2D, obj: FloatingObject, x: number, y: number, scale: number) => {
    const size = obj.size * scale;
    
    ctx.save();
    
    switch (obj.shape) {
      case 'cube':
        drawCube(ctx, x, y, size, obj.rotationX, obj.rotationY, obj.opacity * scale, obj.color);
        break;
      case 'sphere':
        drawSphere(ctx, x, y, size, obj.opacity * scale, obj.color);
        break;
      case 'torus':
        drawTorus(ctx, x, y, size, obj.rotationX, obj.opacity * scale, obj.color);
        break;
      case 'pyramid':
        drawPyramid(ctx, x, y, size, obj.rotationX, obj.rotationY, obj.opacity * scale, obj.color);
        break;
      case 'diamond':
        drawDiamond(ctx, x, y, size, obj.rotationX, obj.rotationY, obj.opacity * scale, obj.color);
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

    const perspective = 1000;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now();

      const mouseInfluence = {
        x: (mouseRef.current.x - centerX) * 0.02,
        y: (mouseRef.current.y - centerY) * 0.02,
      };

      const sortedObjects = [...objectsRef.current].sort((a, b) => b.z - a.z);

      sortedObjects.forEach((obj) => {
        obj.x += obj.vx + mouseInfluence.x * 0.015;
        obj.y += obj.vy + mouseInfluence.y * 0.015 + Math.sin(time * obj.floatSpeed + obj.floatPhase) * obj.floatSpeed * 120;
        obj.z += obj.vz;

        obj.rotationX += obj.rotationSpeedX;
        obj.rotationY += obj.rotationSpeedY;
        obj.rotationZ += obj.rotationSpeedZ;

        const boundsX = canvas.width;
        const boundsY = canvas.height;
        
        if (obj.x < -boundsX) obj.x = boundsX;
        if (obj.x > boundsX) obj.x = -boundsX;
        if (obj.y < -boundsY) obj.y = boundsY;
        if (obj.y > boundsY) obj.y = -boundsY;
        if (obj.z < 100) obj.z = 1200;
        if (obj.z > 1200) obj.z = 100;

        const projected = project(obj.x, obj.y, obj.z, canvas.width, canvas.height, perspective);
        const scale = projected.scale;

        if (scale > 0.08) {
          drawShape(ctx, obj, projected.x, projected.y, scale);
        }

        objectsRef.current.forEach((other) => {
          if (other === obj) return;
          
          const dx = obj.x - other.x;
          const dy = obj.y - other.y;
          const dz = obj.z - other.z;
          const dist3d = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.08);
          
          if (dist3d < 180) {
            const otherProjected = project(other.x, other.y, other.z, canvas.width, canvas.height, perspective);
            const lineOpacity = (1 - dist3d / 180) * 0.06 * scale * otherProjected.scale;
            
            ctx.beginPath();
            ctx.moveTo(projected.x, projected.y);
            ctx.lineTo(otherProjected.x, otherProjected.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      const horizonY = canvas.height * 0.72;
      const gridOpacity = 0.15;
      ctx.strokeStyle = `rgba(168, 85, 247, ${gridOpacity})`;
      ctx.lineWidth = 1.5;

      for (let i = -20; i <= 20; i++) {
        const xBottom = centerX + i * 60;
        const xTop = centerX + i * 15;
        ctx.beginPath();
        ctx.moveTo(xTop, horizonY);
        ctx.lineTo(xBottom, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < 10; i++) {
        const y = horizonY + Math.pow(i / 10, 2.2) * (canvas.height - horizonY);
        const spread = (i / 10) * canvas.width * 1.2;
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
    <div className="fixed inset-0 w-screen h-screen -z-50 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0512 0%, #1a0a2e 50%, #2d1b4e 100%)' }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default FloatingObjects3D;
