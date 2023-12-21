import React, { useState, useEffect } from 'react';
import TopTracks from './components/TopTracks';
import { fetchUserProfile } from './components/SpotifyService'; // Adjust the path as necessary
import { generateRandomString, sha256, base64urlencode } from './crypto'; // Implement these functions

import './index.css'; // Adjust the path if necessary

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      // Step 5: Exchange the Authorization Code for an Access Token
      const codeVerifier = localStorage.getItem('pkce_code_verifier');
      if (codeVerifier) {
        const body = new URLSearchParams({
          client_id: 'a11e05ccf0944dd4b80f117a25913d00',
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:3000/callback',
          code_verifier: codeVerifier
        });

        fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body
        })
        .then(response => response.json())
        .then(data => {
          setToken(data.access_token);
          localStorage.removeItem('pkce_code_verifier'); // Clean up code verifier as it's no longer needed
        })
        .catch(error => {
          console.error('Error exchanging authorization code for token', error);
        });
      }
    } else {
      // Step 1: Create and Store Code Verifier
      const codeVerifier = generateRandomString(128);
      localStorage.setItem('pkce_code_verifier', codeVerifier);

      // Step 2: Create Code Challenge
      sha256(codeVerifier).then(hash => {
        const codeChallenge = base64urlencode(hash);

        // Step 3: Redirect User to Authorization Page
        const authorizeURL = new URL('https://accounts.spotify.com/authorize');
        authorizeURL.searchParams.append('client_id', 'a11e05ccf0944dd4b80f117a25913d00');
        authorizeURL.searchParams.append('response_type', 'code');
        authorizeURL.searchParams.append('redirect_uri', 'http://localhost:3000/callback');
        authorizeURL.searchParams.append('code_challenge_method', 'S256');
        authorizeURL.searchParams.append('code_challenge', codeChallenge);
        authorizeURL.searchParams.append('scope', 'user-top-read playlist-modify-public playlist-modify-private user-library-read');

        window.location.href = authorizeURL.href;
      });
    }
  }, []);

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
  {token ? (
          <TopTracks token={token} userId={userId} />
        ) : (
          <p>Loading...</p> // Show a loading state or a login button
      )}
  </div>
</div>

      
    );
};

export default App;
