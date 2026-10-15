import React, { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Stars, Float, Text, Line, useHelper } from "@react-three/drei";
import * as THREE from "three";
import { Translate } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Droplets, Sprout, Mountain, ZoomIn, RotateCw, Move, ArrowDown, AlertTriangle, RefreshCw, Play, Pause, Thermometer } from "lucide-react";

// --- Terrain Component ---
function Terrain({ showElevation, showSlope, showMoisture }: { showElevation: boolean, showSlope: boolean, showMoisture: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Generate a heightmap
  const { positions, colors, normals } = useMemo(() => {
    const size = 50;
    const segments = 64;
    const pos = [];
    const cols = [];
    const norms = [];
    const color = new THREE.Color();

    // First pass: positions and normals
    const heightMap = (x: number, z: number) => {
      return Math.sin(x * 0.2) * Math.cos(z * 0.2) * 2 + 
             Math.sin(x * 0.5 + z * 0.5) * 0.5;
    };

    const moistureMap = (x: number, z: number) => {
      return (Math.sin(x * 0.1) * Math.cos(z * 0.1) + 1) / 2;
    };

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * size;
        const z = (j / segments - 0.5) * size;
        const y = heightMap(x, z);
        pos.push(x, y, z);

        // Approximate normal for slope calculation
        const eps = 0.1;
        const hx = heightMap(x + eps, z) - heightMap(x - eps, z);
        const hz = heightMap(x, z + eps) - heightMap(x, z - eps);
        const normal = new THREE.Vector3(-hx, 2 * eps, -hz).normalize();
        norms.push(normal.x, normal.y, normal.z);

        // Slope is determined by the y-component of the normal (1 is flat, 0 is vertical)
        const slope = 1 - normal.y; 

        if (showSlope) {
          // Heatmap for slope: Green (flat) to Red (steep)
          if (slope < 0.1) color.set("#22c55e"); // Flat
          else if (slope < 0.3) color.set("#eab308"); // Moderate
          else color.set("#ef4444"); // Steep
        } else if (showMoisture) {
          const moisture = moistureMap(x, z);
          // Blue (wet) to Yellow (dry)
          color.lerpColors(new THREE.Color("#fbbf24"), new THREE.Color("#3b82f6"), moisture);
        } else if (showElevation) {
          if (y > 1.5) color.set("#8B4513"); // Peaks
          else if (y > 0.5) color.set("#556B2F"); // High ground
          else if (y > -0.5) color.set("#228B22"); // Flat land
          else color.set("#2E8B57"); // Valleys
        } else {
          color.set("#3a5a40"); // Standard farm green
        }
        cols.push(color.r, color.g, color.b);
      }
    }
    return { 
      positions: new Float32Array(pos), 
      colors: new Float32Array(cols),
      normals: new Float32Array(norms)
    };
  }, [showElevation, showSlope, showMoisture]);

  const indices = useMemo(() => {
    const segments = 64;
    const ind = [];
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = (i + 1) * (segments + 1) + j;
        const c = (i + 1) * (segments + 1) + (j + 1);
        const d = i * (segments + 1) + (j + 1);
        ind.push(a, b, d);
        ind.push(b, c, d);
      }
    }
    return new Uint16Array(ind);
  }, []);

  return (
    <mesh ref={meshRef} receiveShadow castShadow>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-normal"
          count={normals.length / 3}
          array={normals}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          count={indices.length}
          array={indices}
          itemSize={1}
        />
      </bufferGeometry>
      <meshStandardMaterial vertexColors roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

// --- Water Flow Component ---
function WaterFlow({ showFlow }: { showFlow: boolean }) {
  if (!showFlow) return null;

  // Arrows pointing downhill based on terrain gradient
  const arrows = useMemo(() => {
    const arr = [];
    const size = 40;
    const step = 8;
    const heightMap = (x: number, z: number) => {
      return Math.sin(x * 0.2) * Math.cos(z * 0.2) * 2 + 
             Math.sin(x * 0.5 + z * 0.5) * 0.5;
    };

    for (let x = -size/2; x <= size/2; x += step) {
      for (let z = -size/2; z <= size/2; z += step) {
        const y = heightMap(x, z);
        const eps = 0.1;
        const dx = heightMap(x + eps, z) - heightMap(x - eps, z);
        const dz = heightMap(x, z + eps) - heightMap(x, z - eps);
        // Gradient vector points uphill, so negative points downhill
        const dir = new THREE.Vector3(-dx, 0, -dz).normalize();
        if (dir.length() > 0.1) {
          arr.push({ pos: [x, y + 0.5, z], dir });
        }
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {arrows.map((a, i) => (
        <group key={i} position={new THREE.Vector3(...a.pos)}>
          <primitive object={new THREE.ArrowHelper(a.dir, new THREE.Vector3(0,0,0), 2, 0x3b82f6, 0.5, 0.3)} />
        </group>
      ))}
    </group>
  );
}

// --- Field Boundaries Component ---
function FieldBoundaries() {
  const boundaries = [
    // Rectangle around wheat
    [[-15, 0.5, -15], [5, 0.5, -15], [5, 0.5, 5], [-15, 0.5, 5], [-15, 0.5, -15]],
    // Rectangle around veggies
    [[5, 0.5, 5], [20, 0.5, 5], [20, 0.5, 20], [5, 0.5, 20], [5, 0.5, 5]],
  ];

  return (
    <group>
      {boundaries.map((points, i) => (
        <Line
          key={i}
          points={points as [number, number, number][]}
          color="white"
          lineWidth={2}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}

// --- Crop Visualization Component ---
function Crops({ showCrops }: { showCrops: boolean }) {
  if (!showCrops) return null;

  const cropData = [
    { pos: [-5, 1, -5], color: "#fbbf24", label: "Wheat", count: 15 },
    { pos: [12, 0.5, 12], color: "#22c55e", label: "Vegetables", count: 12 },
    { pos: [-5, 0.8, 15], color: "#eab308", label: "Maize", count: 10 },
  ];

  return (
    <group>
      {cropData.map((crop, i) => (
        <group key={i} position={new THREE.Vector3(...crop.pos)}>
          {/* 3D Zone Marker */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[6, 6, 0.1, 32]} />
            <meshStandardMaterial color={crop.color} transparent opacity={0.3} />
          </mesh>
          {/* 3D Plant Models */}
          {Array.from({ length: crop.count }).map((_, j) => {
            const angle = (j / crop.count) * Math.PI * 2;
            const r = Math.random() * 4;
            const px = Math.cos(angle) * r;
            const pz = Math.sin(angle) * r;
            return (
              <group key={j} position={[px, 0.2, pz]}>
                <mesh position={[0, 0.4, 0]}>
                  <coneGeometry args={[0.15, 0.8, 6]} />
                  <meshStandardMaterial color={crop.color} />
                </mesh>
                <mesh position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
                  <meshStandardMaterial color="#3f2b1d" />
                </mesh>
              </group>
            );
          })}
          <Text
            position={[0, 3, 0]}
            fontSize={1}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="black"
          >
            {crop.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

// --- Irrigation Mapping Component ---
function Irrigation({ showIrrigation }: { showIrrigation: boolean }) {
  const lineRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (lineRef.current && showIrrigation) {
      lineRef.current.children.forEach((child: any) => {
        if (child.material && child.material.dashed) {
          child.material.dashOffset -= 0.01;
        }
      });
    }
  });

  if (!showIrrigation) return null;

  const paths = [
    [[-20, 0.6, -20], [20, 0.6, -20]],
    [[0, 0.6, -20], [0, 0.6, 20]],
    [[-20, 0.6, 0], [20, 0.6, 0]],
  ];

  return (
    <group ref={lineRef}>
      {paths.map((path, i) => (
        <Line
          key={i}
          points={path as [number, number, number][]}
          color="#3b82f6"
          lineWidth={4}
          dashed
          dashScale={2}
          dashSize={0.5}
          gapSize={0.2}
        />
      ))}
      {/* Sprinklers */}
      {[[-10, 0.6, -10], [10, 0.6, 10], [0, 0.6, 0]].map((pos, i) => (
        <group key={i} position={new THREE.Vector3(...pos)}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <Float speed={5} rotationIntensity={2} floatIntensity={0.5}>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  );
}

export default function FarmVision3D() {
  const [layers, setLayers] = useState({
    terrain: true,
    crops: true,
    irrigation: true,
    elevation: true,
    slope: false,
    flow: false,
    moisture: false
  });
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef<any>(null);

  const resetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#5A5A40]">
            <Translate>FarmVision 3D</Translate>
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            <Translate>Advanced 3D terrain analysis, crop modeling, and water flow simulation.</Translate>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={layers.elevation ? "default" : "outline"}
            onClick={() => setLayers(l => ({ ...l, elevation: !l.elevation, slope: false, moisture: false }))}
            className={layers.elevation ? "bg-[#5A5A40]" : ""}
          >
            <Mountain className="w-4 h-4 mr-2" />
            <Translate>Elevation</Translate>
          </Button>
          <Button 
            variant={layers.slope ? "default" : "outline"}
            onClick={() => setLayers(l => ({ ...l, slope: !l.slope, elevation: false, moisture: false }))}
            className={layers.slope ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            <Translate>Slope</Translate>
          </Button>
          <Button 
            variant={layers.moisture ? "default" : "outline"}
            onClick={() => setLayers(l => ({ ...l, moisture: !l.moisture, elevation: false, slope: false }))}
            className={layers.moisture ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Thermometer className="w-4 h-4 mr-2" />
            <Translate>Moisture</Translate>
          </Button>
          <Button 
            variant={layers.flow ? "default" : "outline"}
            onClick={() => setLayers(l => ({ ...l, flow: !l.flow }))}
            className={layers.flow ? "bg-blue-400 hover:bg-blue-500" : ""}
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            <Translate>Flow</Translate>
          </Button>
          <Button 
            variant={layers.crops ? "default" : "outline"}
            onClick={() => setLayers(l => ({ ...l, crops: !l.crops }))}
            className={layers.crops ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Sprout className="w-4 h-4 mr-2" />
            <Translate>Crops</Translate>
          </Button>
          <Button 
            variant={layers.irrigation ? "default" : "outline"}
            onClick={() => setLayers(l => ({ ...l, irrigation: !l.irrigation }))}
            className={layers.irrigation ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            <Droplets className="w-4 h-4 mr-2" />
            <Translate>Irrigation</Translate>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 border-none shadow-xl bg-white overflow-hidden rounded-3xl h-[600px] relative">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[40, 40, 40]} fov={45} />
            <OrbitControls 
              ref={controlsRef}
              enableDamping 
              dampingFactor={0.05}
              minDistance={10}
              maxDistance={120}
              maxPolarAngle={Math.PI / 2.1}
              autoRotate={autoRotate}
              autoRotateSpeed={1}
            />
            
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[50, 50, 25]} 
              intensity={1.2} 
              castShadow 
              shadow-mapSize={[2048, 2048]}
            />
            <Environment preset="forest" />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

            <Terrain showElevation={layers.elevation} showSlope={layers.slope} showMoisture={layers.moisture} />
            <WaterFlow showFlow={layers.flow} />
            <FieldBoundaries />
            <Crops showCrops={layers.crops} />
            <Irrigation showIrrigation={layers.irrigation} />
            
            <gridHelper args={[100, 20, "#e5e5df", "#f5f5f0"]} position={[0, -0.1, 0]} />
          </Canvas>

          {/* Floating Controls */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white"
              onClick={resetView}
              title="Reset View"
            >
              <RefreshCw className="w-5 h-5 text-[#5A5A40]" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className={`rounded-full shadow-lg backdrop-blur-sm transition-colors ${autoRotate ? 'bg-[#5A5A40] text-white' : 'bg-white/80 text-[#5A5A40] hover:bg-white'}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? "Pause Rotation" : "Auto Rotate"}
            >
              {autoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 pointer-events-auto">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Controls</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <ZoomIn className="w-4 h-4" />
                  <span>Scroll to Zoom</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <RotateCw className="w-4 h-4" />
                  <span>Left Click to Rotate</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <Move className="w-4 h-4" />
                  <span>Right Click to Pan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend Overlay */}
          <div className="absolute top-6 right-6 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 pointer-events-auto">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Legend</h4>
              <div className="space-y-2">
                {layers.slope ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                      <span className="text-[10px] font-bold">Steep (Erosion Risk)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                      <span className="text-[10px] font-bold">Moderate Slope</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                      <span className="text-[10px] font-bold">Flat (Optimal)</span>
                    </div>
                  </>
                ) : layers.moisture ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                      <span className="text-[10px] font-bold">High Moisture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                      <span className="text-[10px] font-bold">Dry Soil</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                      <span className="text-[10px] font-bold">Wheat Field</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                      <span className="text-[10px] font-bold">Vegetables</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                      <span className="text-[10px] font-bold">Irrigation Lines</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-white rounded-3xl p-6">
            <h3 className="text-lg font-black text-[#5A5A40] mb-4 flex items-center gap-2">
              <Mountain className="w-5 h-5" />
              Terrain Analysis
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-[10px] font-black text-green-800 uppercase tracking-widest mb-1">Optimal Zones</p>
                <p className="text-xs text-green-700">Flat land (green) identified. Ideal for crops like Wheat and Rice which require stable soil.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Erosion Risk</p>
                <p className="text-xs text-red-700">Steep slopes (red) detected. High risk of water runoff and topsoil loss. Consider terracing.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Water Flow</p>
                <p className="text-xs text-blue-700">Blue arrows show natural drainage. Use this to plan drainage channels and avoid flooding.</p>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-3xl p-6">
            <h3 className="text-lg font-black text-[#5A5A40] mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Irrigation Mapping
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-bold">System Efficiency</span>
                <span className="text-green-600 font-black">94%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[94%]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[8px] text-gray-400 uppercase font-black">Pipelines</p>
                  <p className="text-xs font-bold">3 Active</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[8px] text-gray-400 uppercase font-black">Sprinklers</p>
                  <p className="text-xs font-bold">12 Active</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
