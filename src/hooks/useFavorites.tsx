import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadFavorites(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadFavorites(session.user.id);
      } else {
        setUserId(null);
        setFavorites(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFavorites = async (uid: string) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("car_id")
      .eq("user_id", uid);

    if (error) {
      console.error("Error loading favorites:", error);
      return;
    }

    setFavorites(new Set(data?.map((f) => f.car_id) || []));
  };

  const toggleFavorite = async (carId: string) => {
    if (!userId) {
      toast.error("Please sign in to save favorites");
      return;
    }

    const isFavorite = favorites.has(carId);

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("car_id", carId);

      if (error) {
        toast.error("Error removing favorite");
        return;
      }

      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(carId);
        return next;
      });
      toast.success("Removed from favorites");
    } else {
      // Add to favorites
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, car_id: carId });

      if (error) {
        toast.error("Error adding favorite");
        return;
      }

      setFavorites((prev) => new Set(prev).add(carId));
      toast.success("Added to favorites");
    }
  };

  return { favorites, toggleFavorite, isFavorite: (carId: string) => favorites.has(carId) };
};