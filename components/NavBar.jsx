import Feedback from "./Feedback";
import OnlineCount from "./OnlineCount";
import PlaylistShare from "./PlaylistShare";

export default function NavBar() {
  return (
    <nav className="fixed inset-x-0 top-5 z-20 flex items-center justify-between px-10 max-w-[1600px] mx-auto">
      <PlaylistShare />
      <OnlineCount />
      <Feedback />
    </nav>
  );
}
