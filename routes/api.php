<?php

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Route::middleware(['auth'])->group(function () {
    // Welcome and Consulation routes

    // Admin middleware group within Auth group

//});

Route::middleware(['is_admin'])->group(function () {
    Route::get('welcome', [\App\Http\Controllers\PageController::class, 'welcome']);
    Route::get('consulation', [\App\Http\Controllers\PageController::class, 'consulation']);


    // Welcome and Consulation routes
    Route::get('welcome', [\App\Http\Controllers\PageController::class, 'welcome']);
    Route::get('consulation', [\App\Http\Controllers\PageController::class, 'consulation']);

    // PageController routes
    Route::resource('pages', \App\Http\Controllers\PageController::class);
    // TaskController routes
    Route::resource('checklists/{checklist}/tasks', \App\Http\Controllers\TaskController::class);
    Route::put('checklists/{checklist}/task-positions', [\App\Http\Controllers\TaskController::class, 'updatePosition']);
    // ChecklistController routes
    Route::resource('checklist-groups/{checklist_group}/checklists', \App\Http\Controllers\ChecklistController::class);

    Route::resource('checklist-groups', \App\Http\Controllers\ChecklistGroupController::class);
});
