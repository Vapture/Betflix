import React from 'react';
import styled from 'styled-components';

const FilterWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  
  background: ${props => props.$isActive ? 'rgba(0, 224, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.$isActive ? 'var(--primary-cyan)' : 'var(--border-color)'};
  color: ${props => props.$isActive ? 'var(--primary-cyan)' : 'var(--text-secondary)'};
  
  transition: all 0.2s ease-in-out;
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--primary-cyan);
    transform: translateY(-2px);
  }
`;

interface GameFiltersProps {
    sports: string[];
    selectedSport: string;
    onFilterChange: (sport: string) => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({ sports, selectedSport, onFilterChange }) => {
    return (
        <FilterWrapper>
            {sports.map(sport => (
                <FilterButton 
                    key={sport} 
                    $isActive={selectedSport === sport}
                    onClick={() => onFilterChange(sport)}
                >
                    {sport === 'all' ? 'All Sports' : sport.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </FilterButton>
            ))}
        </FilterWrapper>
    );
};

export default GameFilters;