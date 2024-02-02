<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->foreignId('checklist_id')->constrained();
            $table->string('position')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->string('user_id')->nullable();
            $table->string('task_id')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->boolean('is_my_day')->default(false);
            $table->string('due_date')->nullable();
            $table->string('note')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
