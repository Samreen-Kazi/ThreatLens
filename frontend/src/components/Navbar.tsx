import { NavLink } from "react-router";


function getNavigationClasses({
  isActive,
}: {
  isActive: boolean;
}): string {
  const baseClasses =
    "rounded-lg px-4 py-2 text-sm font-medium transition";

  if (isActive) {
    return `${baseClasses} bg-cyan-400 text-slate-950`;
  }

  return `${baseClasses} text-slate-400 hover:bg-white/5 hover:text-white`;
}


function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Threat
          <span className="text-cyan-400">
            Lens
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={getNavigationClasses}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/history"
            className={getNavigationClasses}
          >
            History
          </NavLink>

           <NavLink
            to="/bulk"
            className={getNavigationClasses}
          >
            Bulk Upload
          </NavLink>
          
        </div>
      </div>
    </nav>
  );
}


export default Navbar;