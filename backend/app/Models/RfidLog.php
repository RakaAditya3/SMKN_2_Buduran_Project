<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfidLog extends Model
{
    protected $fillable = ['uid', 'scanned_at'];
    public $timestamps = false;
}
