<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChecklistGroupRequest;
use App\Http\Resources\ChecklistGroupResource;
use App\Models\ChecklistGroup;
use Illuminate\Http\Request;

class ChecklistGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $checklistGroups = ChecklistGroup::with('checklists')->get()->all();

        return ChecklistGroupResource::collection($checklistGroups);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ChecklistGroupRequest $request)
    {
        $checklistGroup = ChecklistGroup::create($request->validated());

        return new ChecklistGroupResource($checklistGroup);
    }

    /**
     * Display the specified resource.
     */
    public function show(ChecklistGroup $checklistGroup)
    {
        return new ChecklistGroupResource($checklistGroup);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ChecklistGroupRequest $request, ChecklistGroup $checklistGroup)
    {
        $checklistGroup->update($request->validated());

        return new ChecklistGroupResource($checklistGroup);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChecklistGroup $checklistGroup)
    {
        $checklistGroup->delete();

        return ['ok'];
    }
}
