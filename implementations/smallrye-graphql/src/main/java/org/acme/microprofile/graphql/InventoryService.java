package org.acme.microprofile.graphql;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.Map;

@ApplicationScoped
public class InventoryService {

  public static Inventory resolveById(String id) {
      return Inventory.resolveById(id);
  }
}
