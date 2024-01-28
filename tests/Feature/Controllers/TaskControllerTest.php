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
            ->put(route('tasks.complete', $task));

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['data' => [
                'id' => $task->id,
                'name' => $task->name,
                'description' => $task->description,
                'checklistId' => $task->checklist_id,
                'is_completed' => true,
            ]]);
    }
}