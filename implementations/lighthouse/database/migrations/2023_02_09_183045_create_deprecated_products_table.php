<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
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

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('deprecated_products');
    }
};
