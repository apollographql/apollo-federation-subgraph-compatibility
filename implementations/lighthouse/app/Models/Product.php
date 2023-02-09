<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
 * @property array{array{study:array{caseNumber: string, description: string|null}, outcome: string|null}} $research
 *
 * Foreign keys
 * @property string|null $createdByUserEmail
 *
 * Relations
 * @property-read User|null $createdBy
 */
class Product extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'id';

    protected $casts = [
        'dimensions' => 'array',
    ];

    /**
     * @return array{id: string}|null
     */
    public function variation(): ?array
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
