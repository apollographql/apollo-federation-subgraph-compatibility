<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Primary key
 * @property string $studyCaseNumber
 *
 * Attributes
 * @property string|null $outcome
 *
 * Relations
 * @property-read CaseStudy $study
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
}
