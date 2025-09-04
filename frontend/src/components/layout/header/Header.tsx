"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellDot, Globe, Heart, Mic, Moon, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { userManager, authHelpers } from "@/utils/auth";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/app/store/authStore";

function Header() {
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const [isClient, setIsClient] = useState(false);
  const { isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
    // No-op: store already hydrates from localStorage on client
  }, []);

  const handleLogout = async () => {
    try {
      await logout(undefined as unknown as void);
    } catch (e) {
      // ignore API error, proceed to clear local state
    } finally {
      // State is cleared via authStore in useLogout
      router.push("/");
    }
  };

  return (
    <header className="bg-white shadow-md px-24 py-5 relative z-50">
      <div className="flex justify-between items-center mx-auto flex-wrap">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/images/hotel-img.png"
              width={35}
              height={25}
              alt="hotel"
            />
            <p className="text-2xl font-bold pt-2">StayEase</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-[388px] h-[50px] mx-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
            size={20}
          />
          <Input
            type="text"
            placeholder="Otel, Pansiyon, Kiralık daire Ara"
            className="w-full h-full pl-10 pr-10"
          />
          <Mic
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer"
            size={20}
          />
        </div>

        {/* Navbar Links */}
        <nav>
          <div className="flex flex-row items-center gap-1">
            {/* Favorites and Notifications: show only when logged in */}
            {isClient && isLoggedIn && (
              <>
                <Link href="/">
                  <Button variant="ghost" className="cursor-pointer">
                    <Heart className="w-6 h-6 text-[#486284]" />
                  </Button>
                </Link>

                <Link href="/">
                  <Button variant="ghost" className="cursor-pointer">
                    <BellDot className="w-6 h-6 text-[#486284]" />
                  </Button>
                </Link>
              </>
            )}

            <Link href="/">
              <Button variant="ghost" className="cursor-pointer">
                <Moon className="w-6 h-6 text-[#486284]" />
              </Button>
            </Link>

            <Link href="/">
              <div className="flex items-center">
                <Button variant="ghost" className="cursor-pointer">
                  <Globe className="w-6 h-6 text-[#486284]" />
                  <span className="text-[#486284]">EN</span>
                </Button>
              </div>
            </Link>

            {/* Auth area */}
            {isClient && isLoggedIn && (user?.name ?? null) ? (
              <div className="flex items-center gap-3 ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image
                        src="/images/user-image.png"
                        width={35}
                        height={35}
                        alt="user"
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium text-[#486284]">{user?.name}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Hesap</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")}>Profil</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Çıkış Yap</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link href="/auth/login">
                  <Button className="bg-[#2F6FED] hover:bg-[white] hover:text-[#2F6FED] hover:border-[#2F6FED] border-1 text-white font-opensans font-bold cursor-pointer">Giriş Yap</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" className="bg-white border border-[#2F6FED] hover:bg-[#2F6FED] hover:text-white text-[#2F6FED] font-opensans font-bold cursor-pointer">Kayıt Ol</Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
