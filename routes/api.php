<?php

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
Route::get('success', [\App\Http\Controllers\PaymentController::class, 'success']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('user', [App\Http\Controllers\UserController::class, 'show']);

    // PageController routes
    Route::resource('pages', \App\Http\Controllers\PageController::class)->only(['index', 'show']);
    // get favorite tasks
    Route::get('favorite-tasks', [\App\Http\Controllers\TaskController::class, 'favoriteTasks'])->name('tasks.favoriteTasks');

    // payment
    Route::post('payment', [App\Http\Controllers\PaymentController::class, 'payment'])->name('payment');
    // Welcome and Consulation routes
    Route::get('welcome', [\App\Http\Controllers\PageController::class, 'welcome']);
    Route::get('consulation', [\App\Http\Controllers\PageController::class, 'consulation']);
    Route::middleware(['is_admin'])->group(function () {
        Route::resource('pages', \App\Http\Controllers\PageController::class)->only(['store', 'update', 'destroy']);
        Route::resource('checklist-groups', \App\Http\Controllers\ChecklistGroupController::class)
            ->only(['store', 'update', 'destroy']);
        Route::resource('checklist-groups/{checklist_group}/checklists', \App\Http\Controllers\ChecklistController::class)
            ->only(['store', 'update', 'destroy']);    
    });
    
    Route::get('users', [\App\Http\Controllers\UserController::class, 'index']);

    Route::get('checklists/{checklist}', [\App\Http\Controllers\User\ChecklistController::class, 'show'])->name('user.checklist.show');

    // TaskController routes
    Route::put('tasks/{task}/complete', [\App\Http\Controllers\TaskController::class, 'complete'])->name('tasks.complete');
    Route::put('tasks/{task}/favorite', [\App\Http\Controllers\TaskController::class, 'favorite'])->name('tasks.favorite');
    Route::put('tasks/{task}/due-date', [\App\Http\Controllers\TaskController::class, 'dueDate'])->name('tasks.dueDate');
    Route::put('tasks/{task}/note', [\App\Http\Controllers\TaskController::class, 'note'])->name('tasks.note');
    Route::put('tasks/{task}/remind-at', [\App\Http\Controllers\TaskController::class, 'remindAt'])->name('tasks.remindAt');


    Route::resource('checklists/{checklist}/tasks', \App\Http\Controllers\TaskController::class);
    Route::put('checklists/{checklist}/task-positions', [\App\Http\Controllers\TaskController::class, 'updatePosition'])->name('tasks.updatePosition');
    
    // ChecklistController routes
    Route::resource('checklist-groups/{checklist_group}/checklists', \App\Http\Controllers\ChecklistController::class)
        ->only(['index', 'show']);

    Route::resource('checklist-groups', \App\Http\Controllers\ChecklistGroupController::class)->only(['index', 'show']);

    Route::post('upload', [\App\Http\Controllers\UploadController::class, 'upload']);
});

