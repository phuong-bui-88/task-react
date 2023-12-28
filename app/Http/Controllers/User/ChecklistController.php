<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChecklistResource;
use App\Http\Services\ChecklistService;
use App\Models\Checklist;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    /**
     * @param Checklist $checklist
     * @param ChecklistService $checklistService
     * @return ChecklistResource
     */
    public function show(Checklist $checklist, ChecklistService $checklistService, Request $request)
    {
        $checklistService->syncChecklist($checklist, $request->user());

        return new ChecklistResource($checklist);
    }
}
