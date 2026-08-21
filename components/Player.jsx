"use client";

import isMobile from "@/hooks/isMobile";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ListMusic,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

import tracks from "@/data/tracks.json";
import { recordPlay } from "@/lib/stats";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MarqueeText from "./MarqueeText";

const thumb = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

function fmt(sec) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

let ytApiPromise;
function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev && prev();
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }
  return ytApiPromise;
}

export default function Player({ startId }) {
  const [index, setIndex] = useState(() => {
    const i = startId ? tracks.findIndex((t) => t.youtubeId === startId) : -1;
    return i >= 0 ? i : 0;
  });
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [volHover, setVolHover] = useState(false);
  const [volFocus, setVolFocus] = useState(false);
  const [mobile, setMobile] = useState(false);

  const playerRef = useRef(null);
  const holderRef = useRef(null);
  const pollRef = useRef(null);
  const indexRef = useRef(0);
  const shuffleRef = useRef(false);
  const volumeRef = useRef(100);
  const scrubbingRef = useRef(false);
  const lastPlayRef = useRef(null);
  indexRef.current = index;
  shuffleRef.current = shuffle;

  // client-only mobile flag; keeps SSR + first client render identical
  useEffect(() => setMobile(isMobile()), []);

  const track = tracks[index];

  // dir: +1 next, -1 prev; random (avoiding a repeat) when shuffle is on.
  const pick = useCallback((from, dir) => {
    if (tracks.length < 2) return 0;
    if (shuffleRef.current) {
      let n;
      do {
        n = Math.floor(Math.random() * tracks.length);
      } while (n === from);
      return n;
    }
    return (from + dir + tracks.length) % tracks.length;
  }, []);

  const playAt = useCallback((i) => {
    setIndex(i);
    setTime(0);
    playerRef.current?.loadVideoById?.(tracks[i].youtubeId);
  }, []);

  // Create the hidden YouTube player once.
  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !holderRef.current) return;
      const el = document.createElement("div");
      holderRef.current.appendChild(el);
      playerRef.current = new YT.Player(el, {
        videoId: tracks[indexRef.current].youtubeId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volumeRef.current);
            setReady(true);
          },
          onStateChange: (e) => {
            const state = window.YT.PlayerState;
            const d = e.target.getDuration?.() || 0;
            if (d) setDuration(d);
            if (e.data === state.PLAYING) {
              setPlaying(true);
              const vid = e.target.getVideoData?.().video_id;
              if (vid && vid !== lastPlayRef.current) {
                lastPlayRef.current = vid;
                recordPlay(vid);
              }
            } else if (e.data === state.PAUSED) setPlaying(false);
            else if (e.data === state.ENDED) playAt(pick(indexRef.current, 1));
          },
        },
      });
    });
    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
      if (holderRef.current) holderRef.current.innerHTML = "";
    };
  }, [pick, playAt]);

  // Poll time + duration once ready (duration must be known for the seek bar
  // to be draggable; skip time writes while the user is scrubbing).
  useEffect(() => {
    if (!ready) return;
    pollRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      if (!scrubbingRef.current) setTime(p.getCurrentTime() || 0);
      setDuration(p.getDuration() || 0);
    }, 500);
    return () => clearInterval(pollRef.current);
  }, [ready]);

  // Autoplay when the browser allows it; otherwise start on the first user
  // gesture (browsers block audio autoplay until an interaction).
  useEffect(() => {
    if (!ready) return;
    playerRef.current?.playVideo?.();
    const start = () => {
      playerRef.current?.playVideo?.();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [ready]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const onSeek = (e) => {
    const v = Number(e.target.value);
    setTime(v);
    playerRef.current?.seekTo?.(v, true);
  };

  const toggleShuffle = () => {
    shuffleRef.current = !shuffleRef.current;
    setShuffle(shuffleRef.current);
  };

  const applyVolume = (v) => {
    volumeRef.current = v;
    setVolume(v);
    setMuted(v === 0);
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(v);
    if (v > 0) p.unMute();
  };

  const onVolume = (e) => applyVolume(Number(e.target.value));

  const toggleMute = () => {
    const p = playerRef.current;
    if (muted || volume === 0) {
      const v = volume === 0 ? 50 : volume;
      volumeRef.current = v;
      setVolume(v);
      setMuted(false);
      if (p) {
        p.setVolume(v);
        p.unMute();
      }
    } else {
      setMuted(true);
      if (p) p.mute();
    }
  };

  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const volumeOpen = mobile || volHover || volFocus;

  return (
    <>
      {/* Hidden YouTube audio source */}
      <div
        ref={holderRef}
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 -z-10 h-px w-px overflow-hidden opacity-0"
      />

      <div className="flex justify-center px-4 mb-8">
        <div className="w-full max-w-md rounded-2xl bg-black/40 p-3 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div
              className="animate-spin rounded-full overflow-hidden relative"
              style={{ animationDuration: "10s" }}
            >
              <img
                src={thumb(track.youtubeId)}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black/70 ring-2 ring-white/40 rounded-full size-3 aspect-square top-1/2 left-1/2 -translate-1/2" />
            </div>
            <div className="min-w-0 flex-1">
              <MarqueeText className="text-lg font-semibold">
                {track.title}
              </MarqueeText>
              <MarqueeText className="text-base text-white/70">
                {track.artist || "Unknown artist"}
              </MarqueeText>
            </div>
          </div>

          <div className="mt-3">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={time}
              step="any"
              onChange={onSeek}
              aria-label="Seek"
              style={{
                "--_p": duration ? `${(time / duration) * 100}%` : "0%",
              }}
              className="w-full track-slider"
            />
            <div className="flex justify-between text-[10px] tabular-nums text-white/60">
              <span>{fmt(time)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 items-center">
            <div className="justify-self-start">
              <div
                className="relative flex items-center"
                onMouseEnter={() => setVolHover(true)}
                onMouseLeave={() => {
                  if (!mobile) setVolHover(false);
                }}
                onFocus={() => setVolFocus(true)}
                onBlur={() => setVolFocus(false)}
              >
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="text-white/70 hover:text-white cursor-pointer"
                >
                  <VolumeIcon className="h-5 w-5" />
                </button>
                <div
                  className={`absolute top-full -translate-y-1/2 translate-x-2.5 left-0 pb-5 transition-width overflow-hidden duration-150 ${
                    volumeOpen ? "w-24" : "pointer-events-none w-0"
                  }`}
                >
                  <div className="rounded-full px-3 py-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step="1"
                      value={muted ? 0 : volume}
                      onChange={onVolume}
                      aria-label="Volume"
                      style={{ "--_p": `${muted ? 0 : volume}%` }}
                      className="block w-20 volume-slider"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 justify-self-center">
              <button
                type="button"
                onClick={() => playAt(pick(indexRef.current, -1))}
                aria-label="Previous track"
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <SkipBack className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                disabled={!ready}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-12 cursor-pointer w-12 items-center justify-center rounded-full bg-[#f89400] text-black shadow-md transition hover:brightness-110 disabled:opacity-50"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 translate-x-px" />
                )}
              </button>
              <button
                type="button"
                onClick={() => playAt(pick(indexRef.current, 1))}
                aria-label="Next track"
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <SkipForward className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center justify-self-end gap-x-4">
              <button
                type="button"
                onClick={toggleShuffle}
                aria-label="Shuffle"
                aria-pressed={shuffle}
                className={cn(
                  shuffle ? "text-green-400" : "text-white/70 hover:text-white",
                  "cursor-pointer",
                )}
              >
                <Shuffle className="h-4 w-4" />
              </button>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger
                  aria-label="Open playlist"
                  className="text-white/70 hover:text-white cursor-pointer"
                >
                  <ListMusic className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent
                  side={mobile ? "bottom" : "right"}
                  className={`${mobile ? "max-h-[80dvh]" : "max-h-screen"} bg-sideBarBackground`}
                >
                  <SheetHeader>
                    <SheetTitle>Playlist</SheetTitle>
                    <SheetDescription>{tracks.length} songs</SheetDescription>
                  </SheetHeader>
                  <ul className="min-h-0 flex-1 space-y-1 scrollbar-none overflow-y-auto px-2 pb-4">
                    {tracks.map((t, i) => (
                      <li key={`${t.youtubeId}-${i}`}>
                        <button
                          type="button"
                          onClick={() => {
                            playAt(i);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                            i === index ? "bg-muted" : "hover:bg-muted/60"
                          }`}
                        >
                          <img
                            src={thumb(t.youtubeId)}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm">
                              {t.title}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {t.artist || "Unknown artist"}
                            </span>
                          </span>
                          {i === index && (
                            <span className="shrink-0 text-xs font-medium text-green-500">
                              {playing ? "Playing" : "Paused"}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
