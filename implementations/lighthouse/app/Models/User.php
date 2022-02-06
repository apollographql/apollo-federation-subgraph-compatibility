<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Primary key
 * @property string $email
 *
 * Attributes
 * @property int|null $totalProductsCreated
 */
class User extends Authenticatable
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'email';
}
