import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';
import { FaLockOpen } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';

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

const ResponseArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: var(--font-primary);
  resize: vertical;
  margin-bottom: 1rem;
  
  ${props => !props.isEditable && `
    cursor: not-allowed;
    opacity: 0.8;
  `}

  &:focus {
    outline: none;
    border-color: #FF0080;
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-family: var(--font-primary);
  font-weight: 500;
  color: white;
  background: linear-gradient(
    45deg,
    #FF0080,
    #7928CA
  );
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 0, 128, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const GenerateButton = styled(Button)`
  background: linear-gradient(
    45deg,
    #00ff87,
    #60efff
  );
  color: #000;
`;

const EditPrompt = ({ response }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [promptText, setPromptText] = useState(response || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleTextChange = (e) => {
    if (isEditable) {
      setPromptText(e.target.value);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('YOUR_GENERATION_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      // Handle the generated response
      console.log('Generated:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <EditContainer>
      <EditWrapper>
        <ResponseArea
          value={promptText}
          onChange={handleTextChange}
          disabled={!isEditable}
          isEditable={isEditable}
        />
        <ButtonGroup>
          <Button onClick={handleToggleEdit}>
            {isEditable ? (
              <>
                <FaLockOpen /> Lock
              </>
            ) : (
              <>
                <FaLock /> Unlock to Edit
              </>
            )}
          </Button>
          <GenerateButton 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <FaPlay />
            {isGenerating ? 'Generating...' : 'Generate'}
          </GenerateButton>
        </ButtonGroup>
      </EditWrapper>
    </EditContainer>
  );
};

export default EditPrompt;
