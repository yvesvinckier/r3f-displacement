import * as THREE from "three";
import React, { useRef, useState } from "react";

import { useTexture, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import glsl from "glslify";

import faceOne from "../assets/3.jpg";
import faceTwo from "../assets/4.jpg";
import displacementImage from "../assets/displacement/11.jpg";

const ImageDisplacementMaterial = shaderMaterial(
  // Uniform
  {
    effectFactor: 1.2,
    dispFactor: 0,
    uTexture1: undefined,
    uTexture2: undefined,
    uDisp: undefined,
  },

  // Vertex Shader
  glsl`
  varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,

  // Fragment Shader
  glsl`
  varying vec2 vUv;
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    uniform sampler2D uDisp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() {
      vec2 uv = vUv;
      vec4 uDisp = texture2D(uDisp, uv);
      vec2 distortedPosition = vec2(uv.x + dispFactor * (uDisp.r*effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (uDisp.r*effectFactor), uv.y);
      vec4 _texture = texture2D(uTexture1, distortedPosition);
      vec4 _texture2 = texture2D(uTexture2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
  `
);

extend({ ImageDisplacementMaterial });

const Scene = () => {
  const ref = useRef();
  const [face1, face2, dispTexture] = useTexture([
    faceOne,
    faceTwo,
    displacementImage,
  ]);
  const [hovered, setHover] = useState(false);
  useFrame(() => {
    ref.current.dispFactor = THREE.MathUtils.lerp(
      ref.current.dispFactor,
      hovered ? 1 : 0,
      0.075
    );
  });
  return (
    <mesh
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <planeGeometry args={[1, 1.5, 16, 16]} />
      <imageDisplacementMaterial
        ref={ref}
        uTexture1={face1}
        uTexture2={face2}
        uDisp={dispTexture}
        toneMapped={false}
      />
    </mesh>
  );
};

export default Scene;
