-- Concert Friends Database Schema

CREATE TABLE Users (
  UserID SERIAL PRIMARY KEY,
  Username VARCHAR(100),
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Festivals (
  FestivalID SERIAL PRIMARY KEY,
  festival_name VARCHAR(100),
  year INT,
  days INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Groups (
  GroupID SERIAL PRIMARY KEY,
  group_name VARCHAR(100),
  creator_ID INT REFERENCES Users(UserID),
  festival_id INT REFERENCES Festivals(FestivalID),
  group_priority_list TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE GroupMembers (
  group_member_id SERIAL PRIMARY KEY,
  groupID INT REFERENCES Groups(GroupID),
  userID INT REFERENCES Users(UserID)
);

CREATE TABLE Artists (
  artistID SERIAL PRIMARY KEY,
  artist_name VARCHAR(100)
);

CREATE TABLE FestivalArtists (
  festival_artist_id SERIAL PRIMARY KEY,
  festivalID INT REFERENCES Festivals(FestivalID),
  artistID INT REFERENCES Artists(artistID),
  day INT
);

CREATE TABLE UserPriorityList (
  priority_list_id SERIAL PRIMARY KEY,
  groupID INT REFERENCES Groups(GroupID),
  userID INT REFERENCES Users(UserID),
  festivalID INT REFERENCES Festivals(FestivalID),
  day INT,
  artist_list JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE GroupPriorityList (
  priority_list_id SERIAL PRIMARY KEY,
  groupID INT REFERENCES Groups(GroupID),
  festivalID INT REFERENCES Festivals(FestivalID),
  day INT,
  group_list JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
