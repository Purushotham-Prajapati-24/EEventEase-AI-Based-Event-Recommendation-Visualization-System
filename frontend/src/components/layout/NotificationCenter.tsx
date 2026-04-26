import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { fetchNotifications, markRead } from "@/store/slices/notificationsSlice";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Info, Check, CheckCircle2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export const NotificationCenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = (items || []).filter(n => !n.isRead).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRead = (id: string) => {
    dispatch(markRead(id));
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative rounded-full hover:bg-primary/10 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-lg animate-bounce">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 z-50 glass rounded-3xl border border-primary/30 dark:border-primary/20 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-primary/20 bg-primary/10 flex justify-between items-center">
              <h3 className="font-black text-xs uppercase tracking-widest text-primary">Notifications</h3>
              {unreadCount > 0 && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">{unreadCount} New</span>}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {(items || []).length > 0 ? (
                (items || []).map((n) => (
                  <div 
                    key={n._id} 
                    className={`p-4 border-b border-primary/5 flex gap-3 transition-colors hover:bg-primary/10 ${!n.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => handleRead(n._id)}
                  >
                    <div className={`mt-1 p-2 rounded-full ${n.type === 'invite' ? 'bg-accent/20 text-accent' : n.type === 'follow' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                      {n.type === 'invite' ? <Mail className="h-3 w-3" /> : n.type === 'follow' ? <UserPlus className="h-3 w-3" /> : <Info className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-tight">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</p>
                      {n.link && (
                        <Link to={n.link} className="inline-block mt-2 text-[10px] font-bold text-primary hover:underline" onClick={() => setIsOpen(false)}>
                          {n.type === 'follow' ? 'View Profile →' : 'View Event →'}
                        </Link>
                      )}
                    </div>
                    {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary mt-2" />}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-foreground font-black tracking-tight uppercase tracking-widest">All caught up!</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-primary/5 text-center">
              <button className="text-[10px] font-bold text-primary hover:underline">View All Notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
