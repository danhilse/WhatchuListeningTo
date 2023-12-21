// SpotifyService.js

export const createPlaylist = async (userId, token, playlistName = 'My Top Tracks Playlist') => {
    const endpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: playlistName })
    };
  
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();
    return data;
  };


  
  export const addTracksToPlaylist = async (playlistId, tracks, token) => {
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: tracks })
    };
  
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();
    return data;
  };

  // SpotifyService.js

export const fetchUserProfile = async (token) => {
    const endpoint = 'https://api.spotify.com/v1/me';
    const requestOptions = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
  
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();
    return data; // This will include the user's ID
  };
  
  