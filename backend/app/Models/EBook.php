<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EBook extends Model
{
    protected $table = 'ebooks';

    protected $fillable = [
        'title',
        'description',
        'image_path',
    ];
}