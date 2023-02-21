import Link from "next/link";
import type { Session } from "next-auth";
import AuthShowcase from "./AuthShowcase";

const NavBar: React.FC<{ sessionData: Session | null; edit: boolean }> = ({
  sessionData,
  edit,
}) => {
  return (
    <div className="absolute top-2 right-2 flex flex-col items-end justify-items-center gap-1">
      <AuthShowcase {...{ sessionData }} />
      {sessionData && edit === false && (
        <Link
          className="rounded-full bg-white/10 px-2 py-2 text-xs font-bold text-white no-underline transition hover:bg-white/20"
          href="/dashboard"
        >
          edit
        </Link>
      )}
      {sessionData && edit === true && (
        <Link
          className="rounded-full bg-white/10 px-2 py-2 text-xs font-bold text-white no-underline transition hover:bg-white/20"
          href="/"
        >
          home
        </Link>
      )}
    </div>
  );
};

export default NavBar;
