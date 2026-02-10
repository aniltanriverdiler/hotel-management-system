// Authentication hooks isolated in this file
// Keeps auth concerns separate from hotel-related hooks

import { useState, useEffect, useCallback } from "react";
import { authAPI } from "@/data/apiService";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAPI<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = []
): UseAPIState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Bir hata oluştu",
      });
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ...state, refetch: fetchData };
}

export const useMutation = <T, R>(mutationFn: (data: T) => Promise<R>) => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: R | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(
    async (data: T) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const result = await mutationFn(data);
        setState({ loading: false, error: null, data: result });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bir hata oluştu";
        setState({ loading: false, error: errorMessage, data: null });
        throw error;
      }
    },
    [mutationFn]
  );

  return { ...state, mutate };
};

// Auth-specific hooks
export const useLogin = () => {
  const loginToStore = useAuthStore((s) => s.login);
  const mutation = useMutation(
    async (credentials: { email: string; password: string }) => {
      const result = await authAPI.login(credentials);
      // Expect result to include token and user
      const token =
        (result as any)?.token ||
        (result as any)?.accessToken ||
        (result as any)?.data?.token;
      const user =
        (result as any)?.user || (result as any)?.data?.user || result;
      if (token && user) {
        loginToStore({ token, user });
        toast.success("Başarıyla giriş yapıldı!");
      } else {
        toast.error("Giriş bilgileri alınamadı");
      }
      return result;
    }
  );

  // Override mutate to handle errors
  const originalMutate = mutation.mutate;
  const mutate = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        return await originalMutate(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Giriş yapılırken bir hata oluştu";
        toast.error(errorMessage, { duration: 6000 });
        throw error;
      }
    },
    [originalMutate]
  );

  return { ...mutation, mutate };
};

export const useRegister = () => {
  const loginToStore = useAuthStore((s) => s.login);
  const mutation = useMutation(
    async (userData: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      const result = await authAPI.register(userData);
      // Mirror login flow: extract token and user then update store
      const token =
        (result as any)?.token ||
        (result as any)?.accessToken ||
        (result as any)?.data?.token;
      const user =
        (result as any)?.user || (result as any)?.data?.user || result;
      if (token && user) {
        loginToStore({ token, user });
        toast.success("Hesap başarıyla oluşturuldu!");
      } else {
        // Show error if backend didn't return expected auth data
        toast.error("Kayıt başarılı fakat oturum bilgileri alınamadı");
      }
      return result;
    }
  );

  // Override mutate to handle errors
  const originalMutate = mutation.mutate;
  const mutate = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role?: string;
    }) => {
      try {
        return await originalMutate(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Kayıt olurken bir hata oluştu";
        toast.error(errorMessage);
        throw error;
      }
    },
    [originalMutate]
  );

  return { ...mutation, mutate };
};

export const useLogout = () => {
  const logoutFromStore = useAuthStore((s) => s.logout);
  const mutation = useMutation<void, unknown>(async () => {
    try {
      await authAPI.logout();
    } catch (_) {}
    toast.success("Başarıyla çıkış yapıldı!");
  });

  // Always clear local state and do not propagate the error
  const originalMutate = mutation.mutate;
  const mutate = useCallback(
    async (data: void) => {
      try {
        await originalMutate(data);
      } catch (_) {
        // hatayı yut
      } finally {
        logoutFromStore();
      }
    },
    [originalMutate, logoutFromStore]
  );

  return { ...mutation, mutate };
};

export const useVerifyToken = () => useAPI(() => authAPI.verifyToken());

const authHooks = {
  useLogin,
  useRegister,
  useLogout,
  useVerifyToken,
};

export default authHooks;
