<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_research', function (Blueprint $table) {
            $table->string('studyCaseNumber')->unique();
            $table->string('outcome')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_research');
    }
};
