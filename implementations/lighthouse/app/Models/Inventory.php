<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Primary key
 * @property string $id
 *
 * Relations
 * @property-read Collection<int,DeprecatedProduct> $deprecatedProducts
 */
final class Inventory extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    public function deprecatedProducts(): HasMany
    {
        return $this->hasMany(DeprecatedProduct::class);
    }
}
