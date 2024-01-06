<?php

namespace App\Models;

use App\Models\Task; // Add this import statement
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checklist extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'checklist_group_id', 'user_id', 'checklist_id'];

    public function tasks()
    {
        return $this->hasMany(Task::class)->whereNull('user_id')->orderBy('position');
    }

    public function checklistGroup()
    {
        return $this->belongsTo(ChecklistGroup::class);
    }

    public function userTasks()
    {
        $user = request()->user();
        return $this->hasMany(Task::class)
            ->where('user_id', $user->id)->orderBy('position');
    }

}
