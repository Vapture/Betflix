import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  animation: fadeInUp 0.7s ease-out;
`;

const LoginForm = styled.form`
  background: rgba(29, 38, 59, 0.6);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  padding: 2.5rem 3rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TitleContainer = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--text-primary);
  text-shadow: 0 0 15px var(--primary-cyan);
  margin: 0;
`;

const Subtitle = styled.p`
    font-size: 1rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary-cyan);
    box-shadow: 0 0 0 3px rgba(0, 224, 255, 0.3);
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, var(--primary-cyan) 0%, var(--primary-magenta) 100%);
  background-size: 200% 200%;
  color: white;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px 0 rgba(0, 224, 255, 0.3);

  &:hover:not(:disabled) {
    background-position: 100% 0;
    box-shadow: 0 4px 20px 0 rgba(229, 0, 255, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    background: var(--border-color);
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error-red);
  font-size: 0.9rem;
  text-align: center;
  min-height: 1.2rem;
`;

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('player1');
    const [password, setPassword] = useState<string>('password123');
    const [error, setError] = useState<string>('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (!success) {
            setError('Invalid username or password.');
        }
    };

    return (
        <LoginWrapper>
            <LoginForm onSubmit={handleSubmit}>
                <TitleContainer>
                    <Title>Betflix</Title>
                    <Subtitle>Your Ultimate Multi-Betting Interface</Subtitle>
                </TitleContainer>
                <InputGroup>
                    <InputIcon><FaUser /></InputIcon>
                    <StyledInput
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        required
                    />
                </InputGroup>
                <InputGroup>
                    <InputIcon><FaLock /></InputIcon>
                    <StyledInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </InputGroup>
                <ErrorMessage>{error}</ErrorMessage>
                <SubmitButton type="submit">Login</SubmitButton>
            </LoginForm>
        </LoginWrapper>
    );
};

export default LoginPage;