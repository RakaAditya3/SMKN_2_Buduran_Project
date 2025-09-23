<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EBook extends Model
{
    protected $table = 'ebooks';

    protected $fillable = [
        'title',
        'description',
        'image_path',
    ];

     protected $appends = ['image_url'];

        public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) return null;

        return "https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public/{$this->image_path}";
    }
        public function records(): HasMany
    {
        return $this->hasMany(Record::class, 'ebook_id');
    }
}