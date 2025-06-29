'use client';

import { useState, useEffect } from 'react';
import type { UpdatableUser } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLayout from '@/components/AppLayout';
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  if (!user) {
    return <AppLayout><div>Loading...</div></AppLayout>;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!user) return;
    
    const dataToUpdate: UpdatableUser = {};
    const hasNameChanged = name.trim() !== '' && name !== user.name;
    const hasAvatarChanged = !!avatarPreview;

    if (!hasNameChanged && !hasAvatarChanged) {
        toast({
            title: "No Changes",
            description: "Your name and avatar are already up to date.",
        });
        return;
    }

    if (hasNameChanged) {
        dataToUpdate.name = name;
    }
    if (hasAvatarChanged) {
        dataToUpdate.avatar = avatarPreview;
    }
    
    setIsSaving(true);
    try {
      await updateUser(dataToUpdate);
      toast({
          title: "Profile Saved!",
          description: "Your changes have been successfully saved.",
      });
      setAvatarPreview(null);
    } catch (error) {
      // Error toast is handled by the context rollback, but we can add one here if needed.
    } finally {
      setIsSaving(false);
    }
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) return user.avatar;
    return 'https://placehold.co/80x80.png';
  }

  const getFallbackName = () => {
    if (name) return name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
            <h1 className="text-lg font-semibold md:text-2xl">Your Profile</h1>
            <p className="text-sm text-muted-foreground">
                Customize your account details and avatar.
            </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your name and avatar here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={getAvatarSrc()} alt="User Avatar" />
                    <AvatarFallback>{getFallbackName()}</AvatarFallback>
                </Avatar>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar-upload">Change Avatar</Label>
                <Input id="avatar-upload" type="file" accept="image/png, image/jpeg, image/jfif" onChange={handleAvatarChange} />
                <p className="text-xs text-muted-foreground">
                    Upload a new profile picture from your device (JPG, PNG, JFIF).
                </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? <LoaderCircle className="animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
