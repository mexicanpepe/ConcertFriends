import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DashboardWrapper = styled.div`
  margin: 2rem;
`;

const DashboardHeader = styled.h2`
  margin-bottom: 1rem;
`;

const GroupList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GroupItem = styled.li`
  background: #f5f5f5;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
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
