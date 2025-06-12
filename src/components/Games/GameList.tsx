import React from 'react';
import styled from 'styled-components';
import GameCard from './GameCard';
import type { Game } from '../../types';

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const NoGamesMessage = styled.p`
    text-align: center;
    color: var(--text-secondary);
    font-style: italic;
    padding: 2rem;
    grid-column: 1 / -1;
`;

interface GameListProps {
    games: Game[];
    selectedGames: Game[];
    onGameSelect: (game: Game) => void;
}

const GameList: React.FC<GameListProps> = ({ games, selectedGames, onGameSelect }) => {
    if (!games || games.length === 0) {
        return <NoGamesMessage>No games available matching your criteria.</NoGamesMessage>;
    }

    return (
        <ListContainer>
            {games.map((game, index) => (
                <GameCard
                    key={game.id}
                    game={game}
                    isSelected={!!selectedGames.find(g => g.id === game.id)}
                    onSelect={() => onGameSelect(game)}
                    index={index}
                />
            ))}
        </ListContainer>
    );
};

export default GameList;