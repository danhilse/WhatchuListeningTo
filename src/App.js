import React, { useState, useEffect } from 'react';
import { SpotifyAuth } from 'react-spotify-auth';
import TopTracks from './components/TopTracks';
import { fetchUserProfile } from './components/SpotifyService'; // Adjust the path as necessary

import './index.css'; // Adjust the path if necessary

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // Function to handle token after authentication
  const handleToken = (newToken) => {
    setToken(newToken);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      if (token) {
        const userProfile = await fetchUserProfile(token);
        setUserId(userProfile.id);
      }
    };

    getUserProfile();
  }, [token]);

  return (
    
<div className="contents">
   
  <div>
    <h1>Whatchu Listening To?</h1>
    <h3>Your music defines you. Sharing it shouldn't be a chore.</h3>
    <p>
      With just one click, you can connect your Spotify account and this page will generate a playlist that showcases the songs you've had on heavy rotation this month and your most recently liked songs.
      <br /><br />
      Let your friends and followers dive into your musical universe. Discover new tunes together, spark conversations, and relive shared memories through the soundtrack of your life.
      <br /></p>
  </div>
<div className="player">
  {!token ? (
    <SpotifyAuth
      redirectUri='http://localhost:3000/callback'
      clientID='a11e05ccf0944dd4b80f117a25913d00'
      scopes={['user-top-read', 'playlist-modify-public', 'playlist-modify-private', 'user-library-read']}
      onAccessToken={handleToken}
    />
  ) : (
    <TopTracks token={token} userId={userId} />
  )}
  </div>
</div>

      
    );
};

export default App;
