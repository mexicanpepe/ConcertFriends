// CreateGroup.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;

const Tile = styled.div<{ background: string }>`
  width: 250px;
  height: 250px;
  background-image: url(${({ background }) => background});
  background-size: cover;
  background-position: center;
  border: 2px solid #FFCBA4;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const FestivalName = styled.h3`
  margin-top: 1rem;
  color: #6D3E5D;
`;

const YearSelect = styled.select`
  padding: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  border-radius: 8px;
`;

const CreateButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.7rem 1.5rem;
  background-color: #FFB09E;
  border: none;
  border-radius: 8px;
  font-family: 'Pacifico', cursive;
  color: #3E2723;
  cursor: pointer;
  &:hover {
    background-color: #E79788;
  }
`;

interface Festival {
  festivalid: number;
  festival_name: string;
  year: number;
  days: number;
}

const CreateGroup: React.FC = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch('http://localhost:8000/festivals');
        const data = await response.json();
        setFestivals(data);
      } catch (error) {
        console.error('Error fetching festivals:', error);
      }
    };

    fetchFestivals();
  }, []);

  const handleTileClick = (festival: Festival) => {
    setSelectedFestival(festival);
  };

  const handleCreateGroup = async () => {
    if (!selectedFestival) return;

    const cookies = new Cookies();
    const authToken = cookies.get('auth-token');

    try {
      const response = await fetch('http://localhost:8000/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          festivalId: selectedFestival.festivalid,
          groupName: `${selectedFestival.festival_name} ${selectedFestival.year} Group`,
        }),
      });

      if (response.ok) {
        console.log('✅ Group created successfully');
        navigate('/group');
      } else {
        console.error('❌ Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const getFestivalImage = (festivalName: string) => {
    if (festivalName.toLowerCase().includes('coachella')) {
      return '/coachella.png'; // your local image path from public/
    }
    // default or fallback image if needed:
    return '/default-festival.png';
  };

  return (
    <PageWrapper>
      {!selectedFestival ? (
        <>
          {festivals.map((festival) => (
            <div key={festival.festivalid} onClick={() => handleTileClick(festival)}>
              <Tile background={getFestivalImage(festival.festival_name)} />
              <FestivalName>{festival.festival_name}</FestivalName>
            </div>
          ))}
        </>
      ) : (
        <>
          <h3>Select Year:</h3>
          <YearSelect value={selectedFestival.year} disabled>
            <option value={selectedFestival.year}>{selectedFestival.year}</option>
          </YearSelect>
          <CreateButton onClick={handleCreateGroup}>Create Group</CreateButton>
        </>
      )}
    </PageWrapper>
  );
};

export default CreateGroup;
