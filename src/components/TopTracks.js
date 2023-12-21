import React, { useState, useEffect } from 'react';
import { createPlaylist, addTracksToPlaylist } from './SpotifyService';

import { FacebookShareButton, TwitterShareButton, RedditShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, RedditIcon } from 'react-share';

import styles from './TopTracks.module.css';

const fetchTopTracks = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    // console.log(data); // Log the response to check its structure
    return data.items; // Ensure this is the correct path to the array of tracks
};

const fetchLikedSongs = async (token) => {
    const endpoint = 'https://api.spotify.com/v1/me/tracks?limit=15'; // Fetch 15 recent liked songs
    const requestOptions = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
  
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();
    return data.items; // Each item contains a track object
  };

const TopTracks = ({ token, userId }) => {
  const [topTracks, setTopTracks] = useState([]);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const topTracksData = await fetchTopTracks(token);
        const likedSongsResponse = await fetchLikedSongs(token);

        if (!Array.isArray(topTracksData) || !Array.isArray(likedSongsResponse)) {
          throw new Error("Received data is not iterable");
        }

        // Extract the track objects from liked songs
        const likedSongsData = likedSongsResponse.map(item => item.track);

        // Mix top tracks and liked songs
        const maxLength = Math.max(topTracksData.length, likedSongsData.length);
        let combinedTracks = [];
        for (let i = 0; i < maxLength; i++) {
          if (i < topTracksData.length) {
            combinedTracks.push(topTracksData[i]);
          }
          if (i < likedSongsData.length) {
            combinedTracks.push(likedSongsData[i]);
          }
        }

        setTopTracks(combinedTracks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchTracks();
    }
  }, [token]);


  useEffect(() => {
    const handleCreatePlaylist = async () => {
      if (!userId || !Array.isArray(topTracks) || topTracks.length === 0) {
        return; // Ensure userId and topTracks are available
      }
    
      try {
        const trackUris = topTracks.map(track => track.uri);
        const now = new Date();
        const formattedDate = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
        const playlist_name = formattedDate + " I've Been Listening To"
        const playlist = await createPlaylist(userId, token, playlist_name);
        await addTracksToPlaylist(playlist.id, trackUris, token);
        setPlaylistUrl(playlist.external_urls.spotify);
      } catch (error) {
        setError(error.message);
      }
    };

    handleCreatePlaylist();
  }, [userId, topTracks]); // Dependency array includes userId, topTracks, and token

  const copyToClipboard = () => {
    if (!document.hasFocus()) {
      alert("Please click on the page before copying.");
      return;
    }
    navigator.clipboard.writeText(playlistUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error('Error copying text: ', err);
      });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {playlistUrl && (
        <div>
          <div className={styles.spotifyPlayerContainer}>
            <iframe
              title="Spotify Playlist Player"
              src={`https://open.spotify.com/embed/playlist/${playlistUrl.split('/').pop()}`}
              width="100%"
              height="500"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media">
            </iframe>
          </div>
          <div className="buttonRow">
            <button onClick={copyToClipboard}>Copy Link</button>
            <FacebookShareButton url={playlistUrl}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={playlistUrl}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <RedditShareButton url={playlistUrl}>
              <RedditIcon size={32} round />
            </RedditShareButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopTracks;
