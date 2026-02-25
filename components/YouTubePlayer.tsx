'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './YouTubePlayer.module.scss';

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface DocumentWithFullscreen extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface YouTubePlayerProps {
  videoUrl: string;
}

// ── Shared module-level state for YouTube IFrame API loading ──
let apiReady = false;
let apiLoading = false;
const pendingInits: (() => void)[] = [];

function loadYouTubeAPI(initFn: () => void) {
  // API already available – init immediately
  if (apiReady && window.YT && window.YT.Player) {
    initFn();
    return;
  }

  // Queue this init callback
  pendingInits.push(initFn);

  // If the script is already being loaded, just wait for the callback
  if (apiLoading) return;

  apiLoading = true;

  const drainQueue = () => {
    apiReady = true;
    // Call & clear all pending init functions
    while (pendingInits.length > 0) {
      const fn = pendingInits.shift();
      fn?.();
    }
  };

  const existingScript = document.querySelector(
    'script[src="https://www.youtube.com/iframe_api"]'
  );

  if (existingScript) {
    if (window.YT && window.YT.Player) {
      drainQueue();
    } else {
      window.onYouTubeIframeAPIReady = drainQueue;
    }
    return;
  }

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  tag.onerror = () => {
    console.error('Failed to load YouTube IFrame API');
    apiLoading = false;
  };
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = drainQueue;
}

/**
 * Extract the YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    // youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1) || null;
    }

    // youtube.com/watch?v=VIDEO_ID
    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }

    // youtube.com/embed/VIDEO_ID or youtube.com/v/VIDEO_ID
    const pathMatch = parsed.pathname.match(/^\/(embed|v)\/([^/?]+)/);
    if (pathMatch) {
      return pathMatch[2] || null;
    }

    return null;
  } catch {
    return null;
  }
}

export default function YouTubePlayer({ videoUrl }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<YT.Player | null>(null);
  const touchControlsTimerRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(true);

  const videoId = extractVideoId(videoUrl);

  const onPlayerReady = useCallback(() => {
    if (!playerInstanceRef.current) return;
    playerInstanceRef.current.setVolume(volume);
  }, [volume]);

  const onPlayerStateChange = useCallback((event: YT.OnStateChangeEvent) => {
    if (!playerInstanceRef.current) return;

    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      if (touchControlsTimerRef.current) {
        clearTimeout(touchControlsTimerRef.current);
      }
      touchControlsTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
        touchControlsTimerRef.current = null;
      }, 3000);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      setShowControls(true);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      setShowControls(true);
    }
  }, []);

  const initializePlayer = useCallback(() => {
    if (!playerRef.current || !window.YT || playerInstanceRef.current || !videoId) return;

    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      height: '100%',
      width: '100%',
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1,
        enablejsapi: 1,
        disablekb: 1,
        iv_load_policy: 3,
        cc_load_policy: 0,
        autohide: 1,
        origin: typeof window !== 'undefined' ? window.location.origin : '',
        mute: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }, [videoId, onPlayerReady, onPlayerStateChange]);

  useEffect(() => {
    if (!videoId) return;

    loadYouTubeAPI(initializePlayer);

    return () => {
      // Remove from pending queue if not yet called
      const idx = pendingInits.indexOf(initializePlayer);
      if (idx !== -1) pendingInits.splice(idx, 1);

      // Destroy the player instance
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (_e) {
          // Ignore errors during cleanup
        }
        playerInstanceRef.current = null;
      }
    };
  }, [initializePlayer, videoId]);

  useEffect(() => {
    return () => {
      if (touchControlsTimerRef.current) {
        clearTimeout(touchControlsTimerRef.current);
      }
    };
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!playerInstanceRef.current) return;
    if (isPlaying) {
      playerInstanceRef.current.pauseVideo();
    } else {
      playerInstanceRef.current.playVideo();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!playerInstanceRef.current) return;
    if (isMuted) {
      playerInstanceRef.current.unMute();
      setIsMuted(false);
    } else {
      playerInstanceRef.current.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  const changeVolume = useCallback(
    (value: number) => {
      if (!playerInstanceRef.current) return;
      playerInstanceRef.current.setVolume(value);
      setVolume(value);
      if (isMuted && value > 0) {
        playerInstanceRef.current.unMute();
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const fullscreenContainer = container as FullscreenElement;
    const fullscreenDocument = document as DocumentWithFullscreen;

    if (!document.fullscreenElement) {
      if (fullscreenContainer.requestFullscreen) {
        void fullscreenContainer.requestFullscreen();
      } else if (fullscreenContainer.webkitRequestFullscreen) {
        void fullscreenContainer.webkitRequestFullscreen();
      } else if (fullscreenContainer.mozRequestFullScreen) {
        void fullscreenContainer.mozRequestFullScreen();
      } else if (fullscreenContainer.msRequestFullscreen) {
        void fullscreenContainer.msRequestFullscreen();
      }
    } else {
      if (fullscreenDocument.exitFullscreen) {
        void fullscreenDocument.exitFullscreen();
      } else if (fullscreenDocument.webkitExitFullscreen) {
        void fullscreenDocument.webkitExitFullscreen();
      } else if (fullscreenDocument.mozCancelFullScreen) {
        void fullscreenDocument.mozCancelFullScreen();
      } else if (fullscreenDocument.msExitFullscreen) {
        void fullscreenDocument.msExitFullscreen();
      }
    }
  }, []);

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const handleTouchStart = () => {
    if (touchControlsTimerRef.current) {
      clearTimeout(touchControlsTimerRef.current);
    }
    setShowControls(true);
    touchControlsTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
      touchControlsTimerRef.current = null;
    }, 3000);
  };

  const handleCurtainClick = () => {
    if (showControls) {
      togglePlayPause();
    } else {
      setShowControls(true);
    }
  };

  if (!videoId) return null;

  return (
    <div
      ref={containerRef}
      className={styles.videoContainer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStartCapture={handleTouchStart}
    >
      <div ref={playerRef} className={styles.player} />
      <div className={styles.curtain} onClick={handleCurtainClick} />
      <div
        className={`${styles.controls} ${showControls ? styles.controlsVisible : ''}`}
      >
        <div className={styles.controlsLeft}>
          <button
            type="button"
            onClick={togglePlayPause}
            className={styles.controlButton}
            aria-label={isPlaying ? 'השהה' : 'נגן'}
          >
            <span className={styles.icon}>
              {isPlaying ? (
                /* Pause icon */
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 2.5H4V12.5H6V2.5ZM11 2.5H9V12.5H11V2.5Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                /* Play icon */
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.5 2L12.5 7.5L3.5 13V2Z" fill="currentColor" />
                </svg>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className={styles.controlButton}
            aria-label={isMuted ? 'בטל השתקה' : 'השתק'}
          >
            <span className={styles.icon}>
              {isMuted ? (
                /* Speaker off icon */
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.72 1.55L4 5H1V11H4L7.72 14.45V1.55ZM13.41 8L15 6.41L13.59 5L12 6.59L10.41 5L9 6.41L10.59 8L9 9.59L10.41 11L12 9.41L13.59 11L15 9.59L13.41 8Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                /* Speaker on icon */
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.72 1.55L4 5H1V11H4L7.72 14.45V1.55ZM10.5 8C10.5 6.73 9.78 5.63 8.72 5.1V10.89C9.78 10.37 10.5 9.27 10.5 8ZM8.72 1.5V3.06C10.81 3.68 12.28 5.63 12.28 8C12.28 10.37 10.81 12.32 8.72 12.94V14.5C11.67 13.84 13.86 11.17 13.86 8C13.86 4.83 11.67 2.16 8.72 1.5Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>
        <div className={styles.volumeControl}>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className={styles.volumeSlider}
            aria-label="עוצמת קול"
          />
          <span className={styles.volumeValue}>{volume}%</span>
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          className={styles.controlButton}
          aria-label="מסך מלא"
        >
          <span className={styles.icon}>
            {/* Fullscreen icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1V5H2.5V2.5H5V1H1ZM10 1V2.5H12.5V5H14V1H10ZM2.5 10H1V14H5V12.5H2.5V10ZM12.5 12.5H10V14H14V10H12.5V12.5Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

