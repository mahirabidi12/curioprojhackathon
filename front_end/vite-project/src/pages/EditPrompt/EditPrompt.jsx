import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const EditContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
  padding: 2rem;
`;

const EditWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PersonaSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
`;

const PersonaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 1rem;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto 1rem auto;
`;

const PersonaCard = styled.div`
  padding: 1.5rem;
  border-radius: 20px;
  border: 2px solid ${props => props.isSelected ? '#FF0080' : 'rgba(255, 255, 255, 0.1)'};
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 0, 128, 0.2);
  }

  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 1rem;
    border: 3px solid transparent;
    transition: all 0.3s ease;
  }

  &:hover img {
    border-color: #FF0080;
  }

  ${props => props.isSelected && `
    img {
      border-color: #FF0080;
    }
  `}

  h3 {
    font-family: var(--font-primary);
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: white;
  }

  p {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const AddPersonaButton = styled.button`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  border-radius: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--font-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;

  &:hover {
    border-color: #FF0080;
    color: #FF0080;
  }
`;

const ResponseArea = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: var(--font-primary);
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #FF0080;
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
  }
`;

const GenerateButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-family: var(--font-primary);
  font-weight: 500;
  color: white;
  background: linear-gradient(
    45deg,
    #FF0080,
    #7928CA,
    #FF69B4,
    #FF0080
  );
  background-size: 300% 300%;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: aurora-bg 8s ease infinite;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 0, 128, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @keyframes aurora-bg {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Temporary default personas - replace URLs later
const defaultPersonas = [
  {
    id: 1,
    name: "Harsh Sir",
    description: "Professional and engaging teaching style",
    imageUrl: "/assets/images/persona1.jpg"
  },
  {
    id: 2,
    name: "NV Sir",
    description: "Friendly and casual teaching approach",
    imageUrl: "/assets/images/persona2.jpg" // Replace with actual URL
  }
];

const EditPrompt = () => {
  const location = useLocation();
  const [promptText, setPromptText] = useState(location.state?.response || '');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTextChange = (e) => {
    setPromptText(e.target.value);
  };

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona.id);
  };

  const handleAddPersona = () => {
    // This is non-functional as requested
    console.log('Add persona clicked');
  };

  const handleGenerate = async () => {
    if (!selectedPersona) {
      alert('Please select a persona first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3000/user/generateResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: promptText,
          personaId: selectedPersona 
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      console.log(data)

      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <EditContainer>
      <EditWrapper>
        <PersonaSection>
          <SectionTitle>Select a Persona</SectionTitle>
          <PersonaGrid>
            {defaultPersonas.map(persona => (
              <PersonaCard
                key={persona.id}
                isSelected={selectedPersona === persona.id}
                onClick={() => handlePersonaSelect(persona)}
              >
                <img src={persona.imageUrl} alt={persona.name} />
                <h3>{persona.name}</h3>
                <p>{persona.description}</p>
              </PersonaCard>
            ))}
          </PersonaGrid>
          <AddPersonaButton onClick={handleAddPersona}>
            + Add Custom Persona
          </AddPersonaButton>
        </PersonaSection>

        <ResponseArea
          value={promptText}
          onChange={handleTextChange}
          placeholder="Edit your prompt here..."
        />
        <GenerateButton 
          onClick={handleGenerate}
          disabled={isGenerating || !selectedPersona}
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </GenerateButton>
      </EditWrapper>
    </EditContainer>
  );
};

export default EditPrompt;