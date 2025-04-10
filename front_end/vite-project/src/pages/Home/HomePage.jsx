import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AuroraButton from '../../components/AuroraButton/AuroraButton';

const HomeContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
  background: #000; /* Fallback color while video loads */
`;

const BackgroundVideo = styled.video`
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 1;
  object-fit: cover;
`;

const ContentOverlay = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: var(--font-secondary);
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
`;

const Subtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 1.8rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
`;

const HomePage = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const handleCreateClick = () => {
    navigate('/create');
  };

  return (
    <HomeContainer>
      <BackgroundVideo 
        ref={videoRef}
        autoPlay 
        muted 
        loop 
        playsInline
        poster="/assets/videos/poster.jpg" // Optional: Add a poster image while video loads
      >
        <source src="/assets/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </BackgroundVideo>
      <ContentOverlay>
        <HeroSection>
          <Title>
            AI-Powered Education
          </Title>
          <Subtitle>
            Transform learning with personalized video content
          </Subtitle>
          <AuroraButton onClick={handleCreateClick}>
            Create
          </AuroraButton>
        </HeroSection>
      </ContentOverlay>
    </HomeContainer>
  );
};

export default HomePage;
