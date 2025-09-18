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

     protected $appends = ['image_url'];

     public function getImageUrlAttribute()
    {
        return $this->image_path 
            ? asset('storage/' . $this->image_path) 
            : null;
    }
}