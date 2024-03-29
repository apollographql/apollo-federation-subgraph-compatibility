<?php declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_research', function (Blueprint $table): void {
            $table->string('studyCaseNumber')->unique();
            $table->string('outcome')->nullable();
            $table->string('product_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_research');
    }
};
