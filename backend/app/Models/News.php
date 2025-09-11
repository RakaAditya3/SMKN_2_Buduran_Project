<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'slug', 'published_at', 'category_id', 'thumbnail', 'content'];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
