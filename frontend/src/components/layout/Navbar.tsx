import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { logout } from "@/store/slices/authSlice"
import { useTheme } from "../theme-provider"
import { Button } from "../ui/button"
import { Moon, Sun, Zap, LogOut, User } from "lucide-react"
import { NotificationCenter } from "./NotificationCenter"

export const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-primary/10 px-8 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Zap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
            Event<span className="text-primary">Ease</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-6">
                <Link to="/discovery" className="text-sm font-bold hover:text-primary transition-colors">Discovery</Link>
                <Link to="/chat" className="text-sm font-bold hover:text-primary transition-colors">Chat</Link>
                <Link to="/dashboard" className="text-sm font-bold hover:text-primary transition-colors">Dashboard</Link>
                {user.role === 'organizer' && (
                  <Link to="/organizer" className="text-sm font-bold hover:text-primary transition-colors">Organizer</Link>
                )}
              </div>
              <div className="flex items-center gap-4">
                <NotificationCenter />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="rounded-full h-10 w-10 hover:bg-primary/10 transition-colors"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <Link
                  to={`/profile/${user._id}`}
                  title="View Profile"
                  className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center overflow-hidden hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/20"
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-black">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="rounded-full px-4 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full h-10 w-10 hover:bg-primary/10 transition-colors mr-2"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
              </Button>
              <Button asChild variant="ghost" className="font-black text-xs uppercase tracking-widest hover:text-primary transition-colors">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-full px-6 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
