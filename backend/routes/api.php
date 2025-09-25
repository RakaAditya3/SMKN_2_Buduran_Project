<?php
use App\Http\Controllers\EBookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\AchievementController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\ExtracurricularController;
use App\Http\Controllers\Admin\AlumnyController;
use App\Http\Controllers\RecordController;


// === AUTH ===
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-elibrary', [EBookController::class, 'login']);
Route::get('news', [NewsController::class, 'index']);
Route::get('news/{id}', [NewsController::class, 'show']);

// ADMIN
Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('achievements', AchievementController::class);
    Route::apiResource('news', NewsController::class);
    Route::apiResource('extracurriculars', ExtracurricularController::class);
    Route::apiResource('alumni', AlumnyController::class);

    
    Route::post('/ebooks', [EBookController::class, 'store']);
    Route::patch('/books/records/{id}/status', [RecordController::class, 'updateStatus']);
});

// STUDENT
Route::middleware('auth:student')->group(function () {
    Route::get('/ebooks', [EBookController::class, 'index']);
    Route::get('/books/records', [RecordController::class, 'index']);
    Route::post('/books/records', [RecordController::class, 'store']);
    Route::get('/ebooks/{id}', [EBookController::class, 'show']);
   
});
