<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StudentShowcase extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'student_name',
        'student_class',
        'student_major',
        'contact_number',
        'title',
        'slug',
        'description',
        'image_url',
        'project_link',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($showcase) {
            $showcase->slug = Str::slug($showcase->title . '-' . Str::random(5));
        });
    }

}
