// GroupDashboard.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

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
  cursor: pointer;

  &:hover {
    background-color: #FFE7CE;
  }
`;

const CreateGroupButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.7rem 1.5rem;
  background-color: #FFB09E;
  border: none;
  border-radius: 4px;
  font-family: 'Pacifico', cursive;
  color: #3E2723;
  cursor: pointer;
  &:hover {
    background-color: #E79788;
  }
`;

interface Group {
  groupid: number;
  groupname: string;
}

const GroupDashboard: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const authToken = cookies.get('auth-token');

    if (!authToken) {
      console.error('No auth token found.');
      return;
    }

    fetch('http://localhost:8000/groups/user-groups', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user groups', err);
        setLoading(false);
      });
  }, []);

  const handleGroupClick = (groupId: number) => {
    navigate(`/group/${groupId}`);
  };

  const handleCreateGroup = () => {
    navigate('/group/create');
  };

  return (
    <DashboardWrapper>
      <DashboardHeader>Group Dashboard</DashboardHeader>

      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length > 0 ? (
        <>
          <GroupList>
            {groups.map((g) => (
              <GroupItem key={g.groupid} onClick={() => handleGroupClick(g.groupid)}>
                {g.groupname}
              </GroupItem>
            ))}
          </GroupList>
          <CreateGroupButton onClick={handleCreateGroup}>
            Create Group
          </CreateGroupButton>
        </>
      ) : (
        <>
          <p>No groups found.</p>
          <CreateGroupButton onClick={handleCreateGroup}>
            Create Group
          </CreateGroupButton>
        </>
      )}
    </DashboardWrapper>
  );
};

export default GroupDashboard;
