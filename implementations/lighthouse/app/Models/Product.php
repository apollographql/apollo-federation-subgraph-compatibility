<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

/**
 * Primary key
 * @property string $id
 *
 * Attributes
 * @property string|null $sku
 * @property string|null $package
 * @property string|null $variation
 * @property array{size: string|null, weight: float|null}|null $dimensions
 * @property string|null $notes
 *
 * Foreign keys
 * @property string|null $createdByUserEmail
 *
 * Relations
 * @property-read User|null $createdBy
 * @property-read EloquentCollection<int, ProductResearch> $research
 */
final class Product extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $casts = [
        'dimensions' => 'array',
    ];

    /**
     * @return array{id: string}|null
     */
    public function variation(): array|null
    {
        return isset($this->variation)
            ? ['id' => $this->variation]
            : null;
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createdByUserEmail');
    }

    public function research(): HasMany
    {
        return $this->hasMany(ProductResearch::class);
    }
}
