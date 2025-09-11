<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'student_name', 'slug', 'published_at', 'category_id', 'thumbnail'];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
