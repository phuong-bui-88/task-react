<?php

namespace Tests\Feature\Controllers;

use App\Http\Resources\ChecklistGroupResource;
use App\Models\Checklist;
use App\Models\ChecklistGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ChecklistGroupControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function testIndexChecklistGroup()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $task = $this->createTask($checklist);

        // access without token user  
        $response = $this->get('/api/checklist-groups');
        $this->assertEquals(302, $response->getStatusCode());    
        
        $response = $this->actingAs($this->user)
                        ->get('/api/checklist-groups');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJson([
            'data' => [
                [
                    'id' => $checklistGroup->id,
                    'name' => $checklistGroup->name,
                    'checklists' => [
                        [
                            'id' => $checklist->id,
                            'name' => $checklist->name,
                            'tasks' => [],
                        ],
                    ],
                ],
            ],
        ]);

                
        $response = $this->actingAs($this->user)
                        ->get('/api/checklist-groups');
        $response->assertStatus(200);

    }

    /**
     * @test
     */
    public function testStoreChecklistGroup()
    {
        $data = [
            'name' => $this->faker->word,
        ];
        
        // case 1: access without admin user
        $response = $this->actingAs($this->user)
                        ->post('/api/checklist-groups', $data);
        $this->assertEquals(403, $response->getStatusCode());

        // case 2: validate empty name
        $this->withoutExceptionHandling();
        try {
            $data['name'] = '';
            $response = $this->actingAs($this->adminUser)
                            ->post('/api/checklist-groups', $data);
        } catch (ValidationException $e) {
            $this->assertEquals('The name field is required.', $e->validator->errors()->first('name'));
        }                
        
        // case 3: access with admin user
        $data['name'] = $this->faker->word;
        $response = $this->actingAs($this->adminUser)
                        ->post('/api/checklist-groups', $data);
        $response->assertStatus(201);
        $response->assertJson([
            'data' => [
                'name' => $data['name'],
            ],
        ]);
        // check database
        $this->assertDatabaseHas('checklist_groups', [
            'name' => $data['name'],
        ]);
    }

    /**
     * @test
     */
    public function testShowChecklistGroup()
    {
        $checklistGroup = $this->createChecklistGroup();

        array_map(function ($user) use ($checklistGroup) {
            $response = $this->actingAs($user)
                ->get('/api/checklist-groups/' . $checklistGroup->id);

            $response->assertStatus(200);
            $response->assertJson([
                'data' => [
                    'id' => $checklistGroup->id,
                    'name' => $checklistGroup->name,
                ],
            ]);
        }, [$this->user, $this->adminUser]);
    }

    /**
     * @test
     */
    public function testUpdateChecklistGroup()
    {
        $checklistGroup = $this->createChecklistGroup();
        $data['name'] = $this->faker->word;

        // case 1: access without admin user
        $response = $this->actingAs($this->user)
            ->put('/api/checklist-groups/' . $checklistGroup->id, $data);
        $this->assertEquals(403, $response->getStatusCode());
        
        // case 2: validate empty name
        $this->withoutExceptionHandling();
        try {
            $data['name'] = '';
            $response = $this->actingAs($this->adminUser)
                ->put('/api/checklist-groups/' . $checklistGroup->id, $data);
        } catch (ValidationException $e) {
            $this->assertEquals('The name field is required.', $e->validator->errors()->first('name'));
        }

        // case 3: access with admin user
        $data['name'] = $this->faker->word;
        $response = $this->actingAs($this->adminUser)
            ->put('/api/checklist-groups/' . $checklistGroup->id, $data);
        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => $checklistGroup->id,
                'name' => $data['name'],
            ],
        ]);
    }

    /**
     * @test
     */
    public function testDestroyChecklistGroup()
    {
        $checklistGroup = $this->createChecklistGroup();

        // case 1: access without admin user
        $response = $this->actingAs($this->user)
            ->delete('/api/checklist-groups/' . $checklistGroup->id);
        $this->assertEquals(403, $response->getStatusCode());

        // case 2: access with admin user
        $response = $this->actingAs($this->adminUser)
            ->delete('/api/checklist-groups/' . $checklistGroup->id);
        $response->assertStatus(200);
        $response->assertJson(['ok']);
        $this->assertNull(ChecklistGroup::find($checklistGroup->id));
        // Add additional assertions as needed
    }
}