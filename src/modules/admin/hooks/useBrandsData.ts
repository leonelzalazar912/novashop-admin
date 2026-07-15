import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import type { Brand } from "../brands/data/brandsData";

export function useBrandsData() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    async function loadBrands() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: membership } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (!membership) return;

      const { data, error } = await supabase
        .from("brands")
        .select("id, name, country, website, description, active")
        .eq("store_id", membership.store_id)
        .eq("active", true)
        .order("name");

      if (error) {
        console.error(error);
        return;
      }

      setBrands(
        (data ?? []).map((brand) => ({
          id: brand.id,
          name: brand.name,
          country: brand.country ?? "",
          website: brand.website ?? "",
          description: brand.description ?? "",
          active: brand.active,
        }))
      );
    }

    void loadBrands();
  }, []);

  return brands;
}