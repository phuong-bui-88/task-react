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
        $this->updateAttribute('completed_at', $completedAt, $task, $user);
        
        return new TaskResource($task);
    }

    public function favorite(Request $request, Task $task)
    {
        $isFavorite = $request->get('isFavorite', false);
        $user = $request->user();
        $userTask = $this->updateAttribute('is_favorite', $isFavorite, $task, $user);
        
        return new TaskResource($task);
    }

    public function dueDate(Request $request, Task $task)
    {
        $dueDate = $request->get('dueDate', null);
        $time = $this->changeDateTimeToTimestamp($dueDate);

        $user = $request->user();
        $userTask = $this->updateAttribute('due_date', $time, $task, $user);
        
        return new TaskResource($task);   
    }

    public function remindAt(Request $request, Task $task)
    {
        $remindAt = $request->get('remindAt', null);
        $time = $this->changeDateTimeToTimestamp($remindAt);

        $user = $request->user();
        $userTask = $this->updateAttribute('remind_at', $time, $task, $user);
        
        return new TaskResource($task);   
    }

    public function changeDateTimeToTimestamp($dateTime)
    {
        $time = '';
        if ($dateTime != null) {    
            $oldTimeZone = date_default_timezone_get();
            date_default_timezone_set('UTC');
            $time = strtotime($dateTime);
            date_default_timezone_set($oldTimeZone);
        };
        
        return $time;
    }

    public function updateAttribute($attributeName, $attributeValue, Task $task, $user)
    {
        $userTask = Task::where('task_id', $task->id)->where('user_id', $user->id)->first();
        if ($userTask) {
            $userTask->update([$attributeName => $attributeValue]);
        }
        else {
            $userTask = $task->replicate();
            $userTask->user_id = $user->id;
            $userTask->{$attributeName} = $attributeValue;
            $userTask->task_id = $task->id;
            $userTask->save();
        }
        return $userTask;
    }

    /**
     * Get favorite tasks
     */
    public function favoriteTasks(Request $request) {
        $request->merge(['getFavoriteTasks' => true]);
        $user = $request->user();
        $taskIds = $user->tasks()->where('is_favorite', true)->get()->pluck(['task_id']);
        $tasks = Task::whereIn('id', $taskIds)->get();

        return TaskResource::collection($tasks);
    }

    public function note(Request $request, Task $task)
    {
        $note = $request->get('note', null);
        $user = $request->user();
        $userTask = $this->updateAttribute('note', $note, $task, $user);
        
        return new TaskResource($task);
    }
}
