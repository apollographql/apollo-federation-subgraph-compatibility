<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Primary key
 * @property string $caseNumber
 *
 * Attributes
 * @property string|null $description
 */
class CaseStudy extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'caseNumber';
}
