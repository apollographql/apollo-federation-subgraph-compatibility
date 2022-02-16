<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('email')->unique();
            $table->unsignedInteger('totalProductsCreated')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}
