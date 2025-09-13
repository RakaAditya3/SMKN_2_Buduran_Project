<?php

use App\Http\Controllers\EBookController;
use App\Http\Controllers\RecordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ebooks', [EBookController::class, 'index']);
Route::post('/ebooks', [EBookController::class, 'store']);
Route::get('/admin-books/records', [RecordController::class, 'index']);
Route::post('/admin-books/records', [RecordController::class, 'store']);
Route::patch('/admin-books/records/{id}/status', [RecordController::class, 'updateStatus']);