<?php

namespace App\Http\Resources;

use App\Models\Checklist;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChecklistResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isUser = $request->has('is_user') && $request->is_user;

        $userChecklists = Checklist::where('user_id', $user->id);
        $checklistUpdatedAt = $userChecklists->where('checklist_id', $this->id)->max('updated_at');

        $groupIsNew = $this->additional['is_new'] ?? false;
        $groupIsUpdate = $this->additional['is_update'] ?? false;

        $isNew = !$groupIsNew && is_null($checklistUpdatedAt);
        $isUpdate = !$groupIsNew && !$groupIsUpdate && !$isNew && $this->updated_at->gt($checklistUpdatedAt);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_new' => $this->when($isNew && $isUser, $isNew),
            'is_update' => $this->when($isUpdate && $isUser, $isUpdate),
            'checklistGroupId' => $this->checklist_group_id,
            'tasks' => TaskResource::collection($this->tasks),
        ];
    }
}
