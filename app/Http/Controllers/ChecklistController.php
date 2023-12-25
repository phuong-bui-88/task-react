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
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ChecklistRequest $request, ChecklistGroup $checklistGroup)
    {
        $checklistGroup->checklists()->create($request->validated());

        return new ChecklistGroupResource($checklistGroup);
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
        return new ChecklistResource($checklist);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChecklistGroup $checklistGroup, Checklist $checklist)
    {
        $checklist->delete();

        return 'ok';
    }
}
