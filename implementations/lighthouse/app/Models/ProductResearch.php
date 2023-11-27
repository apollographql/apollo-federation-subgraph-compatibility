<?php declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Primary key
 * @property string $studyCaseNumber
 *
 * Attributes
 * @property string|null $outcome
 * @property string|null $product_id
 *
 * Relations
 * @property-read CaseStudy $study
 * @property-read Product|null $product
 */
final class ProductResearch extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'studyCaseNumber';

    public function study(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class, 'studyCaseNumber');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
