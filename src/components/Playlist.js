import React, { useState } from 'react';
import { createPlaylist, addTracksToPlaylist } from './SpotifyService';


const PlaylistCreator = ({ userId, token, topTracks }) => {
    const [playlistUrl, setPlaylistUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePlaylistCreation = async () => {
        setIsLoading(true);
        try {
            const playlist = await createPlaylist(userId, token);
            await addTracksToPlaylist(playlist.id, topTracks.map(track => track.uri), token);
            setPlaylistUrl(playlist.external_urls.spotify);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {playlistUrl && (
                <div>
                    <p>Playlist created successfully!</p>
                    <a href={playlistUrl} target="_blank" rel="noopener noreferrer">Open Playlist</a>
                </div>
            )}
            {error && <p>Error: {error}</p>}
            {!playlistUrl && !isLoading && (
                <button onClick={handlePlaylistCreation}>Create Playlist</button>
            )}
        </div>
    );
};

export default PlaylistCreator;
