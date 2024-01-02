<?php

namespace App\Http\Resources;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $completedUserTask = Task::where('task_id', $this->id)->where('user_id', $user->id)->exists();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'checklistId' => $this->checklist_id,
            'is_completed' => $completedUserTask,
        ];
    }
}
