// GroupDetails.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import MyArtists from './MyArtists';
import GroupPriorityList from './GroupPriorityList';

const PageWrapper = styled.div`
  padding: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem;
  background-color: ${({ active }) => (active ? '#FFB09E' : '#FFE7CE')};
  border: none;
  border-bottom: ${({ active }) => (active ? '4px solid #6D3E5D' : '2px solid #FFCBA4')};
  font-family: 'Pacifico', cursive;
  font-size: 1.2rem;
  color: #3E2723;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #E79788;
  }
`;

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [activeTab, setActiveTab] = useState<'myArtists' | 'groupPriority'>('myArtists');

  return (
    <PageWrapper>
      <h2>🎵 Group Dashboard</h2>

      <Tabs>
        <TabButton
          active={activeTab === 'myArtists'}
          onClick={() => setActiveTab('myArtists')}
        >
          My Artists
        </TabButton>
        <TabButton
          active={activeTab === 'groupPriority'}
          onClick={() => setActiveTab('groupPriority')}
        >
          Group Priority List
        </TabButton>
      </Tabs>

      {activeTab === 'myArtists' ? (
        <MyArtists groupId={groupId!} />
      ) : (
        <GroupPriorityList groupId={groupId!} />
      )}
    </PageWrapper>
  );
};

export default GroupDetails;
