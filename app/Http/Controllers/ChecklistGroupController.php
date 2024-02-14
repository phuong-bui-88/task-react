<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChecklistGroupRequest;
use App\Http\Resources\ChecklistGroupResource;
use App\Models\ChecklistGroup;
use App\Models\Task;
use Illuminate\Http\Request;

class ChecklistGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // add request is_checklist_group to $request
        $request->merge(['is_checklist_group' => true]);
        
        $checklistGroups = ChecklistGroup::with(['checklists' => function ($query) use ($request) {
            $query->whereNull('user_id');
        }, 'checklists.tasks' => function ($query) use ($request) {
            $query->whereNull('user_id');
        }]);

        // count favorite task
        $cgr = ChecklistGroupResource::collection($checklistGroups->get()->keyBy->id);
        $isUser = $request->has('is_user') && $request->is_user;

        if ($isUser) {
            $countUserFavorite = Task::where('user_id', $request->user()->id)
                ->where('is_favorite', true)
                ->count();
                
            $cgr->additional(['analytic' => [
                'count_user_favorite' => $countUserFavorite,
            ]]);
        }

        return $cgr;             
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

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChecklistGroup $checklistGroup)
    {
        $checklistGroup->delete();

        return response()->noContent();
    }
}
