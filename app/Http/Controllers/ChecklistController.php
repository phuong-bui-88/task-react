<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChecklistRequest;
use App\Http\Resources\ChecklistGroupResource;
use App\Http\Resources\ChecklistResource;
use App\Models\Checklist;
use App\Models\ChecklistGroup;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(ChecklistRequest $request, ChecklistGroup $checklistGroup)
    {
        $checklist = $checklistGroup->checklists()->create($request->validated());
        return new ChecklistResource($checklist);
    }

    /**
     * Display the specified resource.
     */
    public function show(ChecklistGroup $checklistGroup, Checklist $checklist)
    {
        return new ChecklistResource($checklist);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ChecklistRequest $request, ChecklistGroup $checklistGroup,  Checklist $checklist)
    {
        $checklist->update($request->validated());
        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChecklistGroup $checklistGroup, Checklist $checklist)
    {
        $checklist->delete();
        return response()->noContent();
    }
}
