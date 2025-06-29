"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Flame,
  LayoutDashboard,
  LogOut,
  Search,
  Star,
  Telescope,
  RefreshCw,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAppSelector } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";


const rotatingTitles = [
  "StreamSphere", 
  "EsferaDeFlujo", 
  "SphèreDeFlux", 
  "StromSphäre", 
  "EsferaDiFlusso", 
  "EsferaDeFluxo", 
  "СфераПотока", 
  "콘텐츠 스피어", 
  "FeedKupla", 
  "StreamKoepel", 
  "GloboFlusso", 
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [title, setTitle] = useState(rotatingTitles[0]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = useAppSelector((state) => state.content.status);
  const query = searchParams.get("search");

  const { user, loading, logout } = useAuth();

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTitle((currentTitle) => {
        let nextTitle = currentTitle;
    
        while (nextTitle === currentTitle) {
          nextTitle =
            rotatingTitles[Math.floor(Math.random() * rotatingTitles.length)];
        }
        return nextTitle;
      });
    }, 2000); 

    return () => clearInterval(intervalId); 
  }, []);

  
  useEffect(() => {
    setSearchInput(query || "");
  }, [query]);

  
  useEffect(() => {
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    if (!loading && !user && !isAuthPage) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchInput.trim();
    if (query) {
      router.push(
        `/?search=${encodeURIComponent(query)}&filter=${searchFilter}`
      );
    } else {
      router.push("/");
    }
  };

  const handleRefresh = () => {
    setSearchInput("");
    if (pathname !== "/" || query) {
      router.push("/");
    } else {
      window.location.reload();
    }
  };

  const getFallbackName = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  if (loading || (!user && pathname !== "/login" && pathname !== "/signup")) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Telescope className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Telescope className="size-6 text-sidebar-primary" />
            <span className="text-lg font-semibold">{title}</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="w-full">
                <SidebarMenuButton
                  tooltip="Dashboard"
                  isActive={pathname === "/" && !query}
                >
                  <LayoutDashboard />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/trending" className="w-full">
                <SidebarMenuButton
                  tooltip="Trending"
                  isActive={pathname === "/trending"}
                >
                  <Flame />
                  Trending
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/favorites" className="w-full">
                <SidebarMenuButton
                  tooltip="Favorites"
                  isActive={pathname === "/favorites"}
                >
                  <Star />
                  Favorites
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto p-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" onClick={logout}>
              <LogOut />
              Log Out
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/profile" className="w-full">
              <SidebarMenuButton
                tooltip={{
                  children: user?.name || "Profile",
                  side: "right",
                  sideOffset: 12,
                }}
                className="h-auto w-full justify-start gap-3 p-2"
                isActive={pathname === "/profile"}
              >
                <Avatar className="size-9 shrink-0">
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={user?.name || "User Avatar"}
                  />
                  <AvatarFallback>{getFallbackName()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left overflow-hidden group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold text-sm truncate">
                    {user?.name}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">
                    {user?.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative flex items-center gap-2 md:w-2/3 lg:w-1/2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for movies, songs, news..."
                    className="w-full appearance-none bg-background pl-8 shadow-none"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Select value={searchFilter} onValueChange={setSearchFilter}>
                  <SelectTrigger className="w-[120px] shrink-0">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              aria-label="Refresh content"
              disabled={status === "loading" || status === "loadingMore"}
            >
              <RefreshCw
                className={`h-5 w-5 ${
                  status === "loading" || status === "loadingMore"
                    ? "animate-spin"
                    : ""
                }`}
              />
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
