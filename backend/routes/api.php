<?php
use App\Http\Controllers\EBookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\User;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\RfidLogController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentShowcaseController;

// === AUTH ===
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-elibrary', [EBookController::class, 'login']);

// === PUBLIC ===
Route::get('news', [NewsController::class, 'index']);
Route::get('news/{id}', [NewsController::class, 'show']);
Route::get('company', [CompanyController::class, 'index']);
Route::post('/complaints', [ComplaintController::class, 'store']);
Route::get('/complaints/{ticket_number}', [ComplaintController::class, 'show']);
Route::get("presensis", [PresensiController::class, 'index']);
Route::get("student-showcase", [StudentShowcaseController::class, 'index']);
Route::get('/showcases/{slug}', [StudentShowcaseController::class, 'show']);

// ADMIN
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/users', function () {
        return response()->json(['data' => User::all()]);
    });
    
    Route::apiResource('students', StudentController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('news', NewsController::class);
    Route::apiResource('ebooks', EBookController::class);
    Route::apiResource("complaints", ComplaintController::class);
    Route::patch('/books/records/{id}/status', [RecordController::class, 'updateStatus']);
    Route::get('/records', [RecordController::class, 'indexAdmin']);

    Route::put('/complaints/{id}', [ComplaintController::class, 'update']);

    Route::post('/rfid-logs', [RfidLogController::class, 'store']);
    Route::get('/rfid/check-scan/{uid}', [RfidLogController::class, 'checkScan']);
    Route::get("presensis", [PresensiController::class, 'index']);
    Route::post('/presensis/process', [PresensiController::class, 'processToday']);
    Route::apiResource("student-showcase", StudentShowcaseController::class);
});

// STUDENT
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/books/records', [RecordController::class, 'index']);
    Route::post('/books/records', [RecordController::class, 'store']);
    Route::get('/ebooks/{id}', [EBookController::class, 'show']);
    Route::get('/ebooks', [EBookController::class, 'index']);
    
});

Route::middleware('auth:sanctum')->get('/debug-token', function (Request $request) {
    return response()->json([
        'auth_guard' => config('auth.defaults.guard'),
        'user' => $request->user(),
        'abilities' => $request->user()?->currentAccessToken()?->abilities,
    ]);
});

