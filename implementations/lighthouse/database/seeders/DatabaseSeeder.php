<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = new User();
        $user->email = 'support@apollographql.com';
        $user->totalProductsCreated = 1337;
        $user->save();

        $product1 = new Product();
        $product1->id = 'apollo-federation';
        $product1->sku = 'federation';
        $product1->package = '@apollo/federation';
        $product1->variation = 'OSS';
        $product1->dimensions = [
            'size' => 'small',
            'weight' => 1,
        ];
        $product1->createdBy()->associate($user);
        $product1->save();
    }
}
