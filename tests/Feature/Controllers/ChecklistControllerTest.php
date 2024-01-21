<?php

namespace Tests\Feature\Controllers;

use App\Http\Resources\ChecklistGroupResource;
use App\Http\Resources\ChecklistResource;
use App\Models\Checklist;
use App\Models\ChecklistGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ChecklistControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function testStoreChecklist()
    {
        $checklistGroup = $this->createChecklistGroup();
        // $checklist = $this->createChecklist($checklistGroup);
        $data['name'] = $this->faker->word;
        // case 1: access without admin user
        $response = $this->actingAs($this->user)
            ->post(route('checklists.store', $checklistGroup), $data);
        $this->assertEquals(403, $response->getStatusCode());
        // case 2: validation error
        $this->withoutExceptionHandling();
        try {
            $response = $this->actingAs($this->adminUser)
                ->post(route('checklists.store', $checklistGroup), []);
        }
        catch (ValidationException $e) {
            $this->assertEquals('The name field is required.', $e->validator->errors()->first('name'));
        }
        // case 3: access with admin user
        $data['name'] = $this->faker->word;
        $response = $this->actingAs($this->adminUser)
            ->post(route('checklists.store', $checklistGroup), $data);
        $response->assertStatus(200);
        $this->assertDatabaseHas('checklists', [
            'name' => $data['name'],
            'checklist_group_id' => $checklistGroup->id,
        ]);
    }

    public function testShowChecklist()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);

        $response = $this->actingAs($this->user)
            ->get(route('checklist-groups.index'));

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
    }

    public function testUpdateChecklist()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        $data['name'] = $this->faker->word;
        // case 1: access without admin user
        $response = $this->actingAs($this->user)
            ->put(route('checklists.update', [$checklistGroup, $checklist]), $data);
        $this->assertEquals(403, $response->getStatusCode());
        // case 2: validation error
        $this->withoutExceptionHandling();
        try {
            $response = $this->actingAs($this->adminUser)
                ->put(route('checklists.update', [$checklistGroup, $checklist]), []);
        }
        catch (ValidationException $e) {
            $this->assertEquals('The name field is required.', $e->validator->errors()->first('name'));
        }
        // case 3: access with admin user
        $data['name'] = $this->faker->word;
        $response = $this->actingAs($this->adminUser)
            ->put(route('checklists.update', [$checklistGroup, $checklist]), $data);
    }

    public function testDestroyChecklist()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        // case 1: access without admin user
        $response = $this->actingAs($this->user)
            ->delete(route('checklists.destroy', [$checklistGroup, $checklist]));
        $this->assertEquals(403, $response->getStatusCode());
        // case 2: access with admin user
        $response = $this->actingAs($this->adminUser)
            ->delete(route('checklists.destroy', [$checklistGroup, $checklist]));
        $response->assertStatus(200);
        $this->assertNull(Checklist::find($checklist->id));
    }
}