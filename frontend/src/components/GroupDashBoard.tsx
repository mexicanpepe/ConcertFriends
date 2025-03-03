// GroupDashBoard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DashboardWrapper = styled.div`
  margin: 2rem 0;
`;

const DashboardHeader = styled.h2`
  margin-bottom: 1rem;
  color: #6D3E5D;
`;

const GroupList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GroupItem = styled.li`
  background: #FFF7F0;
  border: 1px solid #FFCBA4;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #FFE7CE;
  }
`;

interface Group {
  groupId: number;
  groupName: string;
}

const GroupDashboard: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/groups')
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch((err) => console.error('Error fetching groups', err));
  }, []);

  return (
    <DashboardWrapper>
      <DashboardHeader>Group Dashboard</DashboardHeader>
      <GroupList>
        {groups.map((g) => (
          <GroupItem key={g.groupId}>
            <strong>ID:</strong> {g.groupId} | <strong>Name:</strong> {g.groupName}
          </GroupItem>
        ))}
      </GroupList>
    </DashboardWrapper>
  );
};

export default GroupDashboard;
