<?php

namespace App\Models;

use Carbon\Carbon;
use Date;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'checklist_id', 'position', 'completed_at', 'is_favorite', 'is_my_day', 'remind_at', 'due_date', 'note'];

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getRemindAtFormattedAttribute()
    {
        if ($this->remind_at !== null) {
            $carbon =Carbon::createFromTimestamp($this->remind_at);
            return $carbon->format('c');
        }

        return null;
    }
}
