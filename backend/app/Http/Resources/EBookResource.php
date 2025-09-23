<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EBookResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image_url' => $this->image_path 
                ? $this->image_path
                : null,
        ];
    }
}
