<?php

namespace App\Http\Services;


use App\Models\Checklist;

class ChecklistService
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function syncChecklist(Checklist $checklist, $user)
    {
        return Checklist::firstOrCreate(
            [
                'user_id' => $user->id,
                'checklist_id' => $checklist->id,
            ],
            [
                'name' => $checklist->name,
                'checklist_group_id' => $checklist->checklist_group_id,
            ]
        );
    }
}
