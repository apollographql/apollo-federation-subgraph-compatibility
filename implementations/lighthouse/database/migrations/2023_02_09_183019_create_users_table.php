<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->unsignedInteger('totalProductsCreated')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
