<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Primary key
 * @property string $sku
 * @property string $package
 *
 * Attributes
 * @property string|null $reason
 *
 * Foreign keys
 * @property string|null $createdByUserEmail
 *
 * Relations
 * @property-read User|null $createdBy
 */
final class DeprecatedProduct extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = ['sku', 'package'];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createdByUserEmail');
    }
}
