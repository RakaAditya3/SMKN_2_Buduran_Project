<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseService
{
    protected $url;
    protected $key;
    protected $bucket;

    public function __construct()
    {
        $this->url = env('SUPABASE_URL');
        $this->key = env('SUPABASE_KEY');
        $this->bucket = env('SUPABASE_BUCKET');
    }

    public function uploadFile($file, $path)
    {
        $fileName = $path . '/' . uniqid() . '.' . $file->getClientOriginalExtension();

        $response = Http::withHeaders([
            'apikey' => $this->key,
            'Authorization' => 'Bearer ' . $this->key,
            'Content-Type' => $file->getMimeType(),
        ])->put("{$this->url}/storage/v1/object/{$this->bucket}/{$fileName}", file_get_contents($file));

        if ($response->failed()) {
            throw new \Exception('Upload to Supabase failed: ' . $response->body());
        }

        return "{$this->url}/storage/v1/object/public/{$this->bucket}/{$fileName}";
    }
}
