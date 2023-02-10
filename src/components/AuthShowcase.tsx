import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

const AuthShowcase: React.FC<{ sessionData: Session | null }> = ({
  sessionData,
}) => {
  return (
    <button
      className="w-fit rounded-full bg-white/10 px-2 py-2 text-xs font-bold text-white no-underline transition hover:bg-white/20"
      onClick={sessionData ? () => signOut() : () => signIn()}
    >
      {sessionData ? "out" : "in"}
    </button>
  );
};

export default AuthShowcase;
