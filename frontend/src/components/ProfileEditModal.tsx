import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { updateProfile } from "@/store/slices/profileSlice";
import { setUser } from "@/store/slices/authSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/imagekit";

interface ProfileEditModalProps {
  user: any;
  onClose: () => void;
}

export const ProfileEditModal = ({ user, onClose }: ProfileEditModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [interestInput, setInterestInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
      }
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setProfileImage(url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const updatedUser = await dispatch(updateProfile({ 
        userId: user._id, 
        data: { name, bio, profileImage, interests } 
      })).unwrap();
      
      // Update auth state if it's the current user
      dispatch(setUser(updatedUser));
      onClose();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg glass border-primary/30 shadow-2xl rounded-[40px] overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
        <div className="p-8 border-b border-primary/10 flex justify-between items-center bg-primary/5">
          <h2 className="text-2xl font-black italic">Edit <span className="text-primary">Profile</span></h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group h-32 w-32 rounded-[32px] overflow-hidden border-4 border-primary/20 bg-slate-800">
              <img src={profileImage || `https://i.pravatar.cc/150?u=${user._id}`} alt="Avatar" className="h-full w-full object-cover" />
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <ImagePlus className="h-6 w-6 text-white" />}
                <span className="text-[10px] font-black uppercase tracking-widest text-white mt-1">Change</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="rounded-2xl border-primary/20 bg-primary/5 focus-visible:ring-primary h-12 font-bold"
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Bio</label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                className="w-full min-h-[80px] rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium focus:border-primary focus:outline-none transition-all"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">My Interests</label>
              <div className="flex flex-wrap gap-2 p-2 bg-primary/5 border border-primary/10 rounded-2xl">
                {interests.map((interest) => (
                  <span 
                    key={interest} 
                    className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full"
                  >
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)} className="hover:scale-125 transition-transform">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input 
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleAddInterest}
                  className="bg-transparent border-none focus:outline-none text-xs font-bold p-1 flex-1 min-w-[100px]"
                  placeholder="Type & press Enter..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="flex-1 rounded-2xl h-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
