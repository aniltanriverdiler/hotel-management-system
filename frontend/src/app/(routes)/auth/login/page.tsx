"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import { tokenManager, userManager } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { mutate: login, loading, error: loginError } = useLogin();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email ve şifre alanları zorunludur");
      return;
    }

    try {
      const result = await login({ email, password });

      // API helper returns unwrapped data: { token, user }
      if (result?.token) {
        const { token, user } = result;

        // Save token and user data only on client side
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          tokenManager.setToken(token);
          userManager.setUser(user);
        }

        // Redirect based on user role
        if (user?.role === "ADMIN") {
          router.push("/admin");
        } else if (user?.role === "HOTEL_OWNER") {
          router.push("/hotel-owner");
        } else {
          router.push("/");
        }
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific error messages
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Left Panel - Image Background */}
            <div className="lg:w-2/5 relative overflow-hidden">
              {/* Use Next.js Image for optimized image loading */}
              <Image
                src="/images/login-page.jpg"
                alt="Login Background"
                className="w-full h-full object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    Otel Rezervasyon Sistemi
                  </h2>
                  <p className="text-sm lg:text-base text-white/90 leading-relaxed mb-6">
                    Dünyanın en güzel otellerinde unutulmaz anılar biriktirin.
                    Hemen giriş yapın ve hayalinizdeki tatili planlayın.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-xs lg:text-sm text-white/80">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Güvenli Ödeme
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      7/24 Destek
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      En İyi Fiyat
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="lg:w-3/5 flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.history.back()}
                  className="mb-6 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>

                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold font-opensans text-gray-900 mb-2">
                    Giriş Yap
                  </h1>
                  <p className="text-gray-600 font-opensans">
                    Hesabınız yok mu?{" "}
                    <a
                      href="/auth/register"
                      className="text-blue-600 hover:text-blue-700 font-semibold font-opensans"
                    >
                      Kayıt Ol
                    </a>
                  </p>
                </div>

                {/* Error Message */}
                {isClient && (error || loginError) && (
                  <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error || loginError}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-opensans font-bold text-base text-gray-800"
                    >
                      E-posta Adresi
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="font-opensans font-bold text-base text-gray-800"
                    >
                      Şifre
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-12"
                        required
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#2F6FED] hover:bg-[white] hover:text-[#2F6FED] hover:border-[#2F6FED] border-1 text-white font-opensans font-bold w-full h-12 rounded-lg cursor-pointer"
                    size="lg"
                  >
                    {isClient && loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Giriş Yapılıyor...
                      </div>
                    ) : (
                      "Giriş Yap"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="mt-8 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">veya</span>
                    </div>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    size="lg"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google ile Devam Et
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    size="lg"
                  >
                    <svg
                      className="w-5 h-5 mr-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook ile Devam Et
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
