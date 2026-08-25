import BackgroundSlideshow from "./BackgroundSlideshow";
import { Footer } from "components";
import Logo from "./Logo";
import NavBar from "./NavBar";
import Player from "./Player";

// Shared full-screen player; startId optionally boots at a specific track.
export default function PlayerScreen({ startId }) {
  return (
    <>
      <BackgroundSlideshow />
      <NavBar />
      <section className="flex flex-col items-center justify-between h-svh md:h-screen w-screen pt-20">
        <article className="grow flex flex-col items-center justify-between">
          <Logo />
          <Player startId={startId} />
        </article>
        <Footer />
      </section>
    </>
  );
}
