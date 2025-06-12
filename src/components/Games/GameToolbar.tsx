import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const ToolbarWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-grow: 1;
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

const SearchAndSortWrapper = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const InputWrapper = styled.div`
    position: relative;
`;

const SearchInput = styled.input`
    padding-left: 2.5rem;
    width: 200px;
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
`;

const SortWrapper = styled(InputWrapper)`
`;

const SortSelect = styled.select`
    width: 180px;
    padding-right: 2.5rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
`;

const SortIcon = styled(FaChevronDown)`
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    pointer-events: none; 
`;

interface GameToolbarProps {
    sports: string[];
    selectedSport: string;
    onFilterChange: (sport: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
}

const GameToolbar: React.FC<GameToolbarProps> = ({ 
    sports, 
    selectedSport, 
    onFilterChange,
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange
}) => {
    return (
        <ToolbarWrapper>
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

            <SearchAndSortWrapper>
                <InputWrapper>
                    <SearchIcon />
                    <SearchInput 
                        type="text"
                        placeholder="Search by team..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </InputWrapper>

                <SortWrapper>
                    <SortSelect value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                        <option value="date_asc">Date (Soonest)</option>
                        <option value="date_desc">Date (Latest)</option>
                        <option value="odds_asc">Odds (Lowest)</option>
                        <option value="odds_desc">Odds (Highest)</option>
                    </SortSelect>
                    <SortIcon />
                </SortWrapper>
            </SearchAndSortWrapper>
        </ToolbarWrapper>
    );
};

export default GameToolbar;