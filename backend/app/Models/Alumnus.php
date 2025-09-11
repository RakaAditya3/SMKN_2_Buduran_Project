<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alumnus extends Model
{
    use HasFactory;
    protected $table = 'alumni';
    protected $fillable = ['name', 'batch', 'company_id', 'photo'];
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
