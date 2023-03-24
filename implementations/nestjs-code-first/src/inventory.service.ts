import { Injectable } from "@nestjs/common";
import { Inventory } from "./inventory.model";

@Injectable()
export class InventoryService {
    public inventory: Inventory[] = [
        {
            id: "apollo-oss",
            deprecatedProducts: [{
                sku: "apollo-federation-v1",
                package: "@apollo/federation-v1",
                reason: "Migrate to Federation V2",
            }]
        },
    ];
}
