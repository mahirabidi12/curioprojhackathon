import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
  padding: 2rem;
`;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormTitle = styled.h2`
  font-family: var(--font-primary);
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-family: var(--font-primary);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const glowAnimation = `
  @keyframes borderGlow {
    0% {
      border-color: #FF0080;
      box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
    }
    33% {
      border-color: #7928CA;
      box-shadow: 0 0 10px rgba(121, 40, 202, 0.3);
    }
    66% {
      border-color: #FF69B4;
      box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
    }
    100% {
      border-color: #FF0080;
      box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: var(--font-primary);
  font-weight: 400;
  transition: all 0.3s ease;

  ${glowAnimation}

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    animation: borderGlow 4s linear infinite;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-family: var(--font-primary);
    font-weight: 300;
  }
`;

const TextArea = styled(Input).attrs({ as: 'textarea' })`
  min-height: 100px;
  resize: vertical;
`;

const RangeWrapper = styled.div`
  position: relative;
  padding: 2rem 0 1rem;
  margin-top: 1rem;
`;

const RangeValue = styled.div`
  position: absolute;
  top: 0;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  background: linear-gradient(45deg, #FF0080, #7928CA);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: var(--font-primary);
  font-weight: 500;
  white-space: nowrap;
  z-index: 1;
`;

const DurationLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  span {
    font-size: 1rem;
    font-family: var(--font-primary);
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const Range = styled.input.attrs({ type: 'range' })`
  width: 100%;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  height: 4px;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: linear-gradient(45deg, #FF0080, #7928CA);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    background: linear-gradient(45deg, #7928CA, #FF69B4);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: var(--font-primary);
  font-weight: 400;
  cursor: pointer;

  ${glowAnimation}

  &:focus {
    outline: none;
    animation: borderGlow 4s linear infinite;
  }

  option {
    background: #1a1a1a;
    color: white;
    font-family: var(--font-primary);
    font-weight: 400;
  }
`;

const SubmitButton = styled.button`
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
  margin-top: 2rem;
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

const FormPage = () => {
  const [formData, setFormData] = useState({
    topic: '',
    objective: '',
    duration: 30,
    targetAudience: '',
    ageGroup: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/user/createFirstTranscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      // console.log(data);
      
      // Navigate to EditPrompt with the response data
      navigate('/edit-prompt', { state: { response: data } });

    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDurationLabel = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <FormContainer>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          <FormTitle>Create Your Educational Video</FormTitle>
          
          <FormField>
            <Label>Topic</Label>
            <Input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Enter the main topic of your video"
            />
          </FormField>

          <FormField>
            <Label>Objective</Label>
            <TextArea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="What should students learn from this video?"
            />
          </FormField>

          <FormField>
            <DurationLabel>
              <span>Duration</span>
              <span>{getDurationLabel(formData.duration)}</span>
            </DurationLabel>
            <RangeWrapper>
              <RangeValue position={(formData.duration - 30) / ((120 - 30) / 100)}>
                {getDurationLabel(formData.duration)}
              </RangeValue>
              <Range
                name="duration"
                min="30"
                max="120"
                value={formData.duration}
                onChange={handleChange}
              />
            </RangeWrapper>
          </FormField>

          <FormField>
            <Label>Target Audience</Label>
            <Input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              placeholder="Who is this video intended for?"
            />
          </FormField>

          <FormField>
            <Label>Age Group</Label>
            <Select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
            >
              <option value="">Select age group</option>
              <option value="elementary">Elementary School (5-11)</option>
              <option value="middle">Middle School (11-14)</option>
              <option value="high">High School (14-18)</option>
              <option value="college">College (18+)</option>
            </Select>
          </FormField>

          {error && (
            <div style={{ 
              color: '#FF0080', 
              marginTop: '1rem', 
              textAlign: 'center',
              fontFamily: 'var(--font-primary)'
            }}>
              {error}
            </div>
          )}

          <SubmitButton 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Video'}
          </SubmitButton>
        </form>
      </FormWrapper>
    </FormContainer>
  );
};

export default FormPage;
