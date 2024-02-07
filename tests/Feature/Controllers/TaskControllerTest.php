<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\TaskController;
use App\Http\Requests\TaskRequest;
use App\Models\Checklist;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Response;
use Tests\TestCase;
use Carbon\Carbon;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;


    /**
     * Test storing a new task.
     *
     * @return void
     */
    public function testStoreTask()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $taskData = Task::factory()->make()->toArray();

        $response = $this->actingAs($this->adminUser)
            ->post(route('tasks.store', $checklist), $taskData);

        $response->assertStatus(200)
            ->assertJson(['data' => ['tasks' => [$taskData]]]);
    }

    /**
     * Test retrieving a specific task.
     *
     * @return void
     */
    public function testShowTask()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);

        $response = $this->actingAs($this->user)
            ->get(route('tasks.show', [$checklist, $task]));

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['data' => [
                'id' => $task->id,
                'name' => $task->name,
                'description' => $task->description,
                'checklistId' => $task->checklist_id,
            ]]);

        $taskChecklist = $task->checklist;
        $this->assertEquals($taskChecklist->id, $checklist->id);    
    }

    /**
     * Test updating a task.
     *
     * @return void
     */
    public function testUpdateTask()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);
        $updatedTaskData = Task::factory()->make()->toArray();

        $response = $this->actingAs($this->adminUser)
            ->put(route('tasks.update', [$checklist, $task]), $updatedTaskData);

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['data' => $updatedTaskData]);
    }

    /**
     * Test deleting a task.
     *
     * @return void
     */
    public function testDestroyTask()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);
        
        $response = $this->actingAs($this->adminUser)
            ->delete(route('tasks.destroy', [$checklist, $task]));

        $response->assertStatus(Response::HTTP_OK);
        $this->assertEquals($response->getContent(), 'ok');
    }

    /**
     * Test updating task positions.
     *
     * @return void
     */
    public function testUpdatePosition()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $tasks = Task::factory()->count(3)->create(['checklist_id' => $checklist->id])->toArray();

        $updatedTasks = [];
        foreach ($tasks as $index => $task) {
            $updatedTasks[] = [
                'id' => $task['id'],
                'position' => $index + 1,
            ];
        }

        $response = $this->actingAs($this->adminUser)
            ->put(route('tasks.updatePosition', $checklist), ['tasks' => $updatedTasks]);

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['message' => 'Positions updated successfully']);
        // show positions updated
        $this->assertDatabaseHas('tasks', [
            'id' => $tasks[0]['id'],
            'position' => 1,
        ]);    
    }

    /**
     * Test completing a task.
     *
     * @return void
     */
    public function testCompleteTask()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);    

        $response = $this->actingAs($this->user)
            ->put(route('tasks.complete', $task), ['isCompleted' => true]);
        
        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['data' => [
                'id' => $task->id,
                'name' => $task->name,
                'description' => $task->description,
                'checklistId' => $task->checklist_id,
                'is_completed' => true,
            ]]);

        $response = $this->actingAs($this->user)
            ->put(route('tasks.complete', $task), ['isCompleted' => false]);    
        
        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['data' => [
                'id' => $task->id,
                'name' => $task->name,
                'description' => $task->description,
                'checklistId' => $task->checklist_id,
                'is_completed' => false,
            ]]);    
    }

    
    /**
     * Test favorite a task.
     *
     * @return void
     */
    public function testFavoriteTask()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);    

        $response = $this->actingAs($this->user)
            ->put(route('tasks.favorite', ['task' => $task->id]), ['isFavorite' => true]);

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['data' => [
                'name' => $task->name,
                'checklistId' => $checklist->id,
                'is_favorite' => 1,
            ]]);

        $this->assertDatabaseHas('tasks', [
            'task_id' => $task->id,
            'user_id' => $this->user->id,
            'is_favorite' => 1,
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('tasks.favorite', ['task' => $task->id]), ['isFavorite' => false]);
        
        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['data' => [
                'name' => $task->name,
                'checklistId' => $checklist->id,
                'is_favorite' => 0
            ]]);

        $this->assertDatabaseHas('tasks', [
            'task_id' => $task->id,
            'user_id' => $this->user->id,
            'is_favorite' => 0,
        ]);
    }

    public function testDualDateTask() {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);    

        $response = $this->actingAs($this->user)
            ->put(route('tasks.dueDate', ['task' => $task->id]), ['dueDate' => '2021-12-31 00:20:00']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'task_id' => $task->id,
            'user_id' => $this->user->id,
            'due_date' => (new Carbon('2021-12-31 00:20:00'))->timestamp,
        ]);       
    }

    public function testRemindAtTask() {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);    

        $response = $this->actingAs($this->user)
            ->put(route('tasks.remindAt', ['task' => $task->id]), ['remindAt' => '2021-12-31 00:20:00']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'task_id' => $task->id,
            'user_id' => $this->user->id,
            'remind_at' => (new Carbon('2021-12-31 00:20:00'))->timestamp,
        ]);       
    }


    public function testGetFavoriteTask() {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task1 = $this->createTask($checklist);
        $task2 = $this->createTask($checklist);

        $response = $this->actingAs($this->user)
            ->put(route('tasks.favorite', ['task' => $task1->id]), ['isFavorite' => true]);
        
        $response = $this->actingAs($this->user)
            ->put(route('tasks.favorite', ['task' => $task2->id]), ['isFavorite' => true]);


        $response = $this->actingAs($this->user)
            ->get(route('tasks.favoriteTasks'));    

        $response->assertStatus(200);
        $this->assertCount(2, $response['data']);
        $this->assertEquals($response['data'][0]['id'], $task1->id);
        $this->assertEquals($response['data'][1]['id'], $task2->id);
    }

    public function testNoteTask() {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);    

        $response = $this->actingAs($this->user)
            ->put(route('tasks.note', ['task' => $task->id]), ['note' => 'This is a note']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'task_id' => $task->id,
            'user_id' => $this->user->id,
            'note' => 'This is a note',
        ]);
    }
}