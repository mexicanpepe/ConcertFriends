// MyArtists.tsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Cookies from 'universal-cookie';

interface MyArtistsProps {
  groupId: string;
}

interface Artist {
  artistid: number;
  artist_name: string;
}

interface ArtistDetails {
  name: string;
  image: string | null;
  description: string;
  spotifyUrl: string;
}

// 🎬 Fancy Fade Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  margin-top: 2rem;
`;

const ArtistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ArtistTile = styled.div<{ topTen: boolean }>`
  padding: 1rem;
  background: ${({ topTen }) => (topTen ? '#FFECB3' : '#FFF7F0')};
  border: 2px solid ${({ topTen }) => (topTen ? '#FFC107' : '#FFCBA4')};
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    transform: scale(1.02);
    background-color: ${({ topTen }) => (topTen ? '#FFE082' : '#FFE7CE')};
  }
`;

const SubmitButton = styled.button`
  margin-top: 2rem;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  animation: ${fadeIn} 0.4s ease-out forwards;
  text-align: center;
  font-family: 'Pacifico', cursive;
`;

const ArtistName = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #3E2723;
`;

const ArtistImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 12px;
`;

const ArtistDescription = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #5D4037;
`;

const SpotifyLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  font-size: 1rem;
  color: #6D3E5D;
  text-decoration: underline;

  &:hover {
    color: #8E44AD;
  }
`;

const CloseButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.6rem 1.5rem;
  background-color: #FFB09E;
  border: none;
  border-radius: 8px;
  color: #3E2723;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #E79788;
  }
`;

const MyArtists: React.FC<MyArtistsProps> = ({ groupId }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch('http://localhost:8000/festivals/festival-artists/1');
        const data = await res.json();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedArtists = Array.from(artists);
    const [moved] = reorderedArtists.splice(result.source.index, 1);
    reorderedArtists.splice(result.destination.index, 0, moved);

    setArtists(reorderedArtists);
  };

  const handleTileClick = async (artistName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/spotify/search-artist?name=${encodeURIComponent(artistName)}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedArtist(data);
        setModalOpen(true);
      } else {
        console.error('Failed to fetch artist details');
      }
    } catch (error) {
      console.error('Error fetching artist details:', error);
    }
  };

  const handleSubmit = async () => {
    const top10 = artists.slice(0, 10);
    const artistIds = top10.map((artist) => artist.artistid);

    const cookies = new Cookies();
    const authToken = cookies.get('auth-token');

    try {
      const response = await fetch(`http://localhost:8000/groups/user-priority-list/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          groupId,
          festivalId: 1,
          artistIds,
        }),
      });

      if (response.ok) {
        console.log('✅ Priority list saved!');
        alert('Your Top 10 was saved!');
      } else {
        console.error('❌ Failed to save list');
        alert('Failed to save. Try again!');
      }
    } catch (error) {
      console.error('Error submitting Top 10:', error);
    }
  };

  return (
    <Container>
      <h3>🧩 Drag and Drop Your Favorite Artists (Top 10 Highlighted)</h3>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="artists" direction="vertical">
          {(provided) => (
            <ArtistList {...provided.droppableProps} ref={provided.innerRef}>
              {artists.map((artist, index) => (
                <Draggable key={artist.artistid.toString()} draggableId={artist.artistid.toString()} index={index}>
                  {(provided) => (
                    <ArtistTile
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      topTen={index < 10}
                      onClick={() => handleTileClick(artist.artist_name)}
                    >
                      {index + 1}. {artist.artist_name}
                    </ArtistTile>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ArtistList>
          )}
        </Droppable>
      </DragDropContext>

      <SubmitButton onClick={handleSubmit}>Save My List</SubmitButton>

      {modalOpen && selectedArtist && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ArtistName>{selectedArtist.name}</ArtistName>
            {selectedArtist.image && <ArtistImage src={selectedArtist.image} alt={selectedArtist.name} />}
            <ArtistDescription>{selectedArtist.description}</ArtistDescription>
            <SpotifyLink href={selectedArtist.spotifyUrl} target="_blank" rel="noopener noreferrer">
              View on Spotify 🎶
            </SpotifyLink>
            <CloseButton onClick={() => setModalOpen(false)}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default MyArtists;
