<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\DeprecatedProduct;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductResearch;
use App\Models\User;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = new User();
        $user->email = 'support@apollographql.com';
        $user->name = 'Jane Smith';
        $user->totalProductsCreated = 420;
        $user->save();

        $caseStudy1 = new CaseStudy();
        $caseStudy1->caseNumber = '1234';
        $caseStudy1->description = 'Federation Study';
        $caseStudy1->save();

        $research1 = new ProductResearch();
        $research1->study()->associate($caseStudy1);
        $research1->save();

        $caseStudy2 = new CaseStudy();
        $caseStudy2->caseNumber = '1235';
        $caseStudy2->description = 'Studio Study';
        $caseStudy2->save();

        $research2 = new ProductResearch();
        $research2->study()->associate($caseStudy2);
        $research2->save();

        $inventory = new Inventory();
        $inventory->id = 'apollo-oss';
        $inventory->save();

        $deprecatedProduct = new DeprecatedProduct();
        $deprecatedProduct->sku = 'apollo-federation-v1';
        $deprecatedProduct->package = '@apollo/federation-v1';
        $deprecatedProduct->reason = 'Migrate to Federation V2';
        $deprecatedProduct->inventory()->associate($inventory);
        $deprecatedProduct->createdBy()->associate($user);
        $deprecatedProduct->save();

        $productFederation = new Product();
        $productFederation->id = 'apollo-federation';
        $productFederation->sku = 'federation';
        $productFederation->package = '@apollo/federation';
        $productFederation->variation = 'OSS';
        $productFederation->dimensions = [
            'size' => 'small',
            'weight' => 1,
            'unit' => 'kg'
        ];
        $productFederation->createdBy()->associate($user);
        $productFederation->save();
        $productFederation->research()->save($research1);

        $productStudio = new Product();
        $productStudio->id = 'apollo-studio';
        $productStudio->sku = 'studio';
        $productStudio->createdBy()->associate($user);
        $productStudio->save();
        $productStudio->research()->save($research2);
    }
}
