<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\DeprecatedProduct;
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
        $user->save();

        $caseStudy1 = new CaseStudy();
        $caseStudy1->caseNumber = '1234';
        $caseStudy1->description = 'Federation Study';
        $caseStudy1->save();

        $research1 = new ProductResearch();
        // $research1->studyCaseNumber = 'federation';
        $research1->study()->associate($caseStudy1);
        $research1->save();

        $caseStudy2 = new CaseStudy();
        $caseStudy2->caseNumber = '1235';
        $caseStudy2->description = 'Studio Study';
        $caseStudy2->save();

        $research2 = new ProductResearch();
        // $research2->studyCaseNumber = 'studio';
        $research2->study()->associate($caseStudy2);
        $research2->save();

        $deprecatedProduct = new DeprecatedProduct();
        $deprecatedProduct->sku = 'apollo-federation-v1';
        $deprecatedProduct->package = '@apollo/federation-v1';
        $deprecatedProduct->reason = 'Migrate to Federation V2';
        $deprecatedProduct->createdBy()->associate($user);
        $deprecatedProduct->save();

        $product1 = new Product();
        $product1->id = 'apollo-federation';
        $product1->sku = 'federation';
        $product1->package = '@apollo/federation';
        $product1->variation = 'OSS';
        $product1->dimensions = [
            'size' => 'small',
            'weight' => 1,
            'unit' => 'kg'
        ];
        $product1->createdBy()->associate($user);
        $product1->save();
    }
}
