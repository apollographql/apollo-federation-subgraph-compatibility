<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventory extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    public function deprecatedProducts(): HasMany
    {
        return $this->hasMany(DeprecatedProduct::class);
    }
}
