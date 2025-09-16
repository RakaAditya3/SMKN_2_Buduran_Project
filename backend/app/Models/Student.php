<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'nama',
        'nisn',
        'password',
        'uid',
        'kelas',
        'jurusan',
        'no_absen',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
