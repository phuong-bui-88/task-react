<?php

namespace App\Http\Resources;

use App\Models\Checklist;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChecklistGroupResource extends JsonResource
{
    public $preserveKeys = true;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isUser = $request->has('is_user') && $request->is_user;
        $userChecklists = Checklist::where('user_id', $user->id)
            ->where('checklist_group_id', $this->id)
            ->whereNull('deleted_at');

        $groupUpdatedAt = $userChecklists->selectRaw('MAX(updated_at) as aggregate')->value('aggregate');
        
        $isNew = is_null($groupUpdatedAt);
        $isUpdate = !$isNew && $this->updated_at->gt($groupUpdatedAt);

        $checklists = $this->checklists->mapWithKeys(function ($checklist) use ($isUser, $isNew, $isUpdate) {
            $item = new ChecklistResource($checklist);
            if ($isUser) {
                $item->additional(['is_new' => $isNew, 'is_update' => $isUpdate]);
            }
            return [$checklist->id => $item];
        });

        // count favorite task
        if ($isUser) {
            $countUserFavorite = Task::where('user_id', $user->id)
                ->where('is_favorite', true)
                ->count();
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'checklists' => $checklists,
            'is_new' => $this->when($isNew && $isUser, $isNew),
            'is_update' => $this->when($isUpdate && $isUser, $isUpdate),
        ];
    }
}
