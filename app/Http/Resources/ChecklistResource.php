<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'checklistGroupId' => $this->checklist_group_id,
            'tasks' => $this->when($request->routeIs('checklists.show'), TaskResource::collection($this->tasks)),
        ];
    }
}
