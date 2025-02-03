package org.acme.microprofile.graphql;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.Map;

@ApplicationScoped
public class InventoryService {

  public static Inventory resolveReference(Map<String, Object> reference) {
    if (reference.get("id") instanceof String id) {
      return Inventory.resolveById(id);
    }
    return null;
  }
}
