<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Http\Resources\ChecklistResource;
use App\Http\Resources\TaskResource;
use App\Models\Checklist;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request, Checklist $checklist)
    {
        $checklist->tasks()->create($request->validated());

        return new ChecklistResource($checklist);
    }

    /**
     * Display the specified resource.
     */
    public function show(Checklist $checklist, Task $task)
    {
        $task = $checklist->tasks()->where('id', $task->id)->first();

        return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, Checklist $checklist, Task $task)
    {
        $task->update($request->validated());

        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Checklist $checklist, Task $task)
    {
        $task->delete();

        return 'ok';
    }

    public function updatePosition(Request $request, Checklist $checklist)
    {
        $tasks = $request->get('tasks', []);

        foreach ($tasks as $task) {
            $checklist->tasks()->where('id', $task['id'])->update(['position' => $task['position']]);
        }

        return response()->json(['message' => 'Positions updated successfully']);
    }

    public function complete(Request $request, Task $task)
    {
        $completedAt = $request->get('isCompleted') == true ? now() : null;
        $user = $request->user();
        $userTask = Task::where('task_id', $task->id)->where('user_id', $user->id)->first();
        
        if ($userTask) {
            $userTask->update(['completed_at' => $completedAt]);
        }
        else {
            $userTask = $task->replicate();
            $userTask->user_id = $user->id;
            $userTask->completed_at = $completedAt;
            $userTask->task_id = $task->id;
            $userTask->save();
        }
        
        return new TaskResource($task);
    }
}
