// GroupPriorityList.tsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface GroupPriorityListProps {
  groupId: string;
}

interface ArtistPriority {
  artistId: number;
  artistName: string;
  points: number;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  margin-top: 2rem;
`;

const ArtistList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
`;

const ArtistItem = styled.li<{ rank: number }>`
  background: ${({ rank }) =>
    rank === 0
      ? '#FFE082'
      : rank === 1
      ? '#CFD8DC'
      : rank === 2
      ? '#FFCCBC'
      : '#FFF7F0'};
  border: 2px solid #FFCBA4;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Pacifico', cursive;
  font-size: 1.2rem;
  color: #3E2723;
  animation: ${fadeIn} 0.6s ease both;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const RankBadge = styled.span`
  background-color: #FFB09E;
  color: #3E2723;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 50%;
  font-size: 1rem;
`;

const GroupPriorityList: React.FC<GroupPriorityListProps> = ({ groupId }) => {
  const [groupPriorityList, setGroupPriorityList] = useState<ArtistPriority[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupPriorityList = async () => {
      try {
        const response = await fetch(`http://localhost:8000/groups/${groupId}/group-priority-list`);
        if (response.ok) {
          const data = await response.json();
          setGroupPriorityList(data);
        } else {
          console.error('Failed to fetch group priority list');
        }
      } catch (error) {
        console.error('Error fetching group priority list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupPriorityList();
  }, [groupId]);

  return (
    <Container>
      <h3>🎯 Group Priority List (Group ID: {groupId})</h3>

      {loading ? (
        <p>Loading group priority list...</p>
      ) : groupPriorityList.length > 0 ? (
        <ArtistList>
          {groupPriorityList.map((artist, index) => (
            <ArtistItem key={artist.artistId} rank={index}>
              <RankBadge>{index + 1}</RankBadge>
              {artist.artistName}
              <span>{artist.points} pts</span>
            </ArtistItem>
          ))}
        </ArtistList>
      ) : (
        <p>No group priority list yet. Ask members to submit their Top 10!</p>
      )}
    </Container>
  );
};

export default GroupPriorityList;
