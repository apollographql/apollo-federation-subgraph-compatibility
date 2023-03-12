import {
    Resolver,
    ResolveReference,
} from "@nestjs/graphql";
import { Inventory } from "./inventory.model";
import { InventoryService } from "./inventory.service";

@Resolver(Inventory)
export class InventoryResolver {
    constructor(private readonly inventoryService: InventoryService) { }

    @ResolveReference()
    public resolveReference(reference: Inventory) {
        const { inventory } = this.inventoryService;
        return inventory.find(
            (inv) => reference.id === inv.id,
        );
    }
}
