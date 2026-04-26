import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserMinus, UserPlus, Mail, Search, X } from "lucide-react";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AttendeeManagerProps {
  eventId: string;
  onClose: () => void;
}

export const AttendeeManager = ({ eventId, onClose }: AttendeeManagerProps) => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [blacklistedUsers, setBlacklistedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const fetchAttendees = async () => {
    try {
      const response: any = await api.get(`/events/${eventId}`);
      setActiveUsers(response.registeredAttendees || []);
      setBlacklistedUsers(response.blacklistedUsers || []);
    } catch (error) {
      console.error("Failed to fetch attendees", error);
    } finally {
      // Done
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await api.post(`/events/${eventId}/remove/${userId}`);
      const userToRemove = activeUsers.find(u => u._id === userId);
      if (userToRemove) {
        setActiveUsers(activeUsers.filter(u => u._id !== userId));
        setBlacklistedUsers([...blacklistedUsers, userToRemove]);
      }
    } catch (error) {
      console.error("Remove failed", error);
    }
  };

  const reAddUser = async (userId: string) => {
    try {
      await api.post(`/events/${eventId}/readd/${userId}`);
      const userToReAdd = blacklistedUsers.find(u => u._id === userId);
      if (userToReAdd) {
        setBlacklistedUsers(blacklistedUsers.filter(u => u._id !== userId));
        setActiveUsers([...activeUsers, userToReAdd]);
      }
    } catch (error) {
      console.error("Re-add failed", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass border-primary/30 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
          <div>
            <CardTitle className="text-2xl font-black">Manage <span className="text-primary">Attendees</span></CardTitle>
            <p className="text-sm text-muted-foreground">Manage registrations and invites for this event.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Active Attendees */}
          <section>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Active Registrations ({activeUsers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeUsers.map(u => (
                <div key={u._id} className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all">
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeUser(u._id)} className="text-destructive hover:bg-destructive/10">
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {activeUsers.length === 0 && <p className="text-sm text-muted-foreground col-span-full italic">No active registrations.</p>}
            </div>
          </section>

          {/* Removed List */}
          <section>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-destructive">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              Removed List ({blacklistedUsers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blacklistedUsers.map(u => (
                <div key={u._id} className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/10 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => reAddUser(u._id)} className="text-primary hover:bg-primary/10">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {blacklistedUsers.length === 0 && <p className="text-sm text-muted-foreground col-span-full italic">No users in removed list.</p>}
            </div>
          </section>

          {/* Invite Section */}
          <section className="pt-4 border-t border-primary/10">
            <h3 className="text-lg font-bold mb-4">Invite Students</h3>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-primary/5 border border-primary/10 focus:border-primary focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="rounded-full bg-accent hover:bg-accent/90 shadow-lg">
                <Mail className="mr-2 h-4 w-4" /> Send Invite
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};
