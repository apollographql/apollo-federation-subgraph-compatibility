package com.netflix.graphql.dgs.compatibility.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import com.netflix.graphql.dgs.compatibility.model.Inventory;
import java.util.Map;
import org.jetbrains.annotations.NotNull;

@DgsComponent
public class InventoryDataFetcher {

  @DgsEntityFetcher(name = "Inventory")
  public static Inventory resolveReference(@NotNull Map<String, Object> reference) {
    if (reference.get("id") instanceof String id) {
      return Inventory.resolveById(id);
    }
    return null;
  }
}
