<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Primary key
 * @property string $email
 *
 * Attributes
 * @property string|null $name
 *
 * External
 * @property int|null $totalProductsCreated
 * @property int $yearsOfEmployment
 */
final class User extends Authenticatable
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'email';

    public function averageProductsCreatedPerYear(): float|null
    {
        return isset($this->totalProductsCreated) && isset($this->yearsOfEmployment)
            ? round($this->totalProductsCreated / $this->yearsOfEmployment)
            : null;
    }
}
