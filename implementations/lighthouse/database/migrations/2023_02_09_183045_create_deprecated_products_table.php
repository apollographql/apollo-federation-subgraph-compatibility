<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('deprecated_products', function (Blueprint $table) {
            $table->string('sku');
            $table->string('package');
            $table->string('reason')->nullable();
            $table->string('createdByUserEmail')->nullable();

            $table->unique(['sku', 'package']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deprecated_products');
    }
};
