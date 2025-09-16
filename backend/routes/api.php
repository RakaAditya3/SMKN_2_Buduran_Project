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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/login-elibrary', [EBookController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
Route::get('/user', function (Request $request) {
return $request->user();
});

Route::post('/logout', [AuthController::class, 'logout']);

Route::prefix('admin')->group(function () {
Route::apiResource('categories', CategoryController::class);
Route::apiResource('companies', CompanyController::class);
Route::apiResource('achievements', AchievementController::class);
Route::apiResource('news', NewsController::class);
Route::apiResource('extracurriculars', ExtracurricularController::class);
Route::apiResource('alumni', AlumnyController::class);
Route::get('/ebooks', [EBookController::class, 'index']);
Route::post('/ebooks', [EBookController::class, 'store']);
Route::get('/admin-books/records', [RecordController::class, 'index']);
Route::post('/admin-books/records', [RecordController::class, 'store']);
Route::patch('/admin-books/records/{id}/status', [RecordController::class, 'updateStatus']);
});
});