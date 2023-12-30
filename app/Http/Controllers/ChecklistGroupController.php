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
    public function index(Request $request)
    {
        $checklistGroups = ChecklistGroup::with(['checklists' => function ($query) use ($request) {
            $query->whereNull('user_id');
        }]);

        if ($request->has('is_user') && $request->is_user) {
            $checklistGroups->whereHas('checklists');
        }

        return ChecklistGroupResource::collection($checklistGroups->get());
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
