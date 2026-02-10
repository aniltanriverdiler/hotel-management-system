import { useState, useEffect, useCallback, useRef } from "react";
import socketService from "@/services/socketService";
import { SocketConnectionStatus, SocketError } from "@/types/socket";
import { authHelpers } from "@/utils/auth";

// ===============================================
// 🎯 useSocket Hook - Socket Connection Management
// ===============================================

/**
 * 🔌 Hook that integrates the socket connection into the React component lifecycle
 *
 * This hook does the following:
 * - Keeps socket connection status in state
 * - Manages automatic connection on component mount/unmount
 * - Handles authentication errors
 * - Runs reconnection logic
 *
 * @param autoConnect - Should it automatically connect when the component mounts? (default: true)
 * @returns Socket connection state and control functions
 */
export const useSocket = (autoConnect: boolean = true) => {
  // ===============================================
  // 📊 STATE MANAGEMENT
  // ===============================================

  // Connection status - we use enum values
  const [connectionStatus, setConnectionStatus] =
    useState<SocketConnectionStatus>("disconnected");

  // Error state - details are stored here if an error occurs
  const [error, setError] = useState<SocketError | null>(null);

  // Number of reconnection attempts
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Last connection time (for debugging)
  const [lastConnectedAt, setLastConnectedAt] = useState<Date | null>(null);

  // ===============================================
  // 📋 REF MANAGEMENT
  // ===============================================

  // Ref to store reconnection timer
  const reconnectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if component is unmounted (to prevent memory leaks)
  const isMountedRef = useRef(true);

  // ===============================================
  // 🎯 CALLBACK FUNCTIONS
  // ===============================================

  /**
   * 🔗 Start the socket connection
   * This function can be called manually (e.g. via button click)
   */
  const connect = useCallback(async () => {
    try {
      // If already connected or trying to connect, skip
      if (
        connectionStatus === "connected" ||
        connectionStatus === "connecting"
      ) {
        console.log("🔄 Already connected or connecting, skipping...");
        return;
      }

      console.log("🔌 Socket connection is starting...");
      setConnectionStatus("connecting");
      setError(null);

      // Authentication check
      if (!authHelpers.isLoggedIn()) {
        throw new Error("User is not logged in");
      }

      // Actual socket connection
      const socket = await socketService.connect();

      if (socket && isMountedRef.current) {
        setConnectionStatus("connected");
        setLastConnectedAt(new Date());
        setReconnectAttempts(0);
        console.log("✅ Socket connection successful");
      }
    } catch (err) {
      console.error("❌ Socket connection error:", err);

      if (isMountedRef.current) {
        setConnectionStatus("error");
        setError({
          type: "connection",
          message: err instanceof Error ? err.message : "Connection error",
          originalError: err,
        });
      }
    }
  }, [connectionStatus]);

  /**
   * 📴 Close the socket connection
   * This function is called manually or on component unmount
   */
  const disconnect = useCallback(() => {
    console.log("📴 Closing socket connection...");

    // Clear reconnection timer
    if (reconnectionTimerRef.current) {
      clearTimeout(reconnectionTimerRef.current);
      reconnectionTimerRef.current = null;
    }

    // Close the socket
    socketService.disconnect();

    if (isMountedRef.current) {
      setConnectionStatus("disconnected");
      setError(null);
      setReconnectAttempts(0);
    }
  }, []);

  /**
   * 🔄 Automatic reconnection logic
   * When the connection is lost, it retries after a certain delay
   */
  const attemptReconnection = useCallback(() => {
    const maxAttempts = 3; // Fewer attempts
    const baseDelay = 3000; // 3 seconds initial delay

    if (reconnectAttempts >= maxAttempts) {
      console.warn("⚠️ Maximum reconnection attempts exceeded");
      setConnectionStatus("error");
      setError({
        type: "connection",
        message: `Connection could not be established after ${maxAttempts} attempts`,
      });
      return;
    }

    // Exponential backoff: 3s, 6s, 12s
    const delay = baseDelay * Math.pow(2, reconnectAttempts);

    console.log(
      `🔄 Reconnection will be attempted in ${delay}ms... (${
        reconnectAttempts + 1
      }/${maxAttempts})`
    );

    reconnectionTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setReconnectAttempts((prev) => prev + 1);
        connect();
      }
    }, delay);
  }, [reconnectAttempts, connect]);

  // ===============================================
  // 🎪 SOCKET EVENT LISTENERS
  // ===============================================

  useEffect(() => {
    console.log("🎪 Setting up socket event listeners...");

    // ✅ When the connection is successful
    socketService.onConnection(() => {
      if (isMountedRef.current) {
        console.log("🎉 Socket onConnection event received");
        setConnectionStatus("connected");
        setError(null);
        setReconnectAttempts(0);
        setLastConnectedAt(new Date());
      }
    });

    // ❌ When the connection is lost
    socketService.onDisconnection((reason: string) => {
      if (isMountedRef.current) {
        console.log("💔 Socket onDisconnection event received:", reason);
        setConnectionStatus("disconnected");

        // If the user disconnected manually, do not reconnect
        if (reason !== "io client disconnect") {
          attemptReconnection();
        }
      }
    });

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up socket event listeners...");
      // Note: socketService handles its own cleanup
    };
  }, [attemptReconnection]);

  // ===============================================
  // 🚀 COMPONENT LIFECYCLE MANAGEMENT
  // ===============================================

  // Automatically connect when the component mounts
  useEffect(() => {
    if (autoConnect && authHelpers.isLoggedIn()) {
      console.log("🚀 Component mounted, starting automatic connection...");
      connect();
    }

    // Component unmount cleanup
    return () => {
      console.log("👋 Component is unmounting, closing socket...");
      isMountedRef.current = false;

      // Clear timers
      if (reconnectionTimerRef.current) {
        clearTimeout(reconnectionTimerRef.current);
      }

      // Close the socket
      socketService.disconnect();
    };
  }, [autoConnect, connect]);

  // State synchronization with socketService - only on initial load
  useEffect(() => {
    const serviceConnected = socketService.getConnectionStatus();
    if (serviceConnected && connectionStatus !== "connected") {
      console.log(
        "🔄 useSocket: synchronizing with socketService -> connected"
      );
      setConnectionStatus("connected");
      setError(null);
      setLastConnectedAt(new Date());
    }
    // Periodic checks were removed - event listeners are sufficient
  }, []); // Run only once on mount

  // ===============================================
  // 🔍 COMPUTED VALUES (Derived values)
  // ===============================================

  // Simple boolean flags (for convenient use in UI)
  const isConnected = connectionStatus === "connected";
  const isConnecting = connectionStatus === "connecting";
  const isDisconnected = connectionStatus === "disconnected";
  const hasError = connectionStatus === "error" || error !== null;

  // ===============================================
  // 📤 HOOK API (Return values)
  // ===============================================

  return {
    // 📊 State information
    connectionStatus,
    isConnected,
    isConnecting,
    isDisconnected,
    hasError,
    error,
    reconnectAttempts,
    lastConnectedAt,

    // 🎮 Control functions
    connect,
    disconnect,

    // 🔍 Utility functions
    getSocket: socketService.getSocket, // Access to socket instance for debugging
    isLoggedIn: authHelpers.isLoggedIn, // Check auth status
  };
};

// ===============================================
// 📋 TYPE EXPORTS
// ===============================================

// Export hook's return type (for usage in other places)
export type UseSocketReturn = ReturnType<typeof useSocket>;

// Default export
export default useSocket;
