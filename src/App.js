import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import "./App.css";

import Scene from "./components/Scene";

const StyledcanvasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-right: auto;
  margin-left: auto;
  width: 36vw;
  height: 52vw;
  border: 1px solid transparent;
  border-radius: 900px;
`;

function App() {
  return (
    <StyledcanvasWrapper>
      <StyledImageContainer>
        <Canvas camera={{ position: [0, 0, 2], fov: 38 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </StyledImageContainer>
    </StyledcanvasWrapper>
  );
}

export default App;
