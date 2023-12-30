<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'checklist_id', 'position'];

    public function checklists()
    {
        $this->belongsTo(Checklist::class);
    }
}