<?php

namespace Tests\Feature\Controllers\User;

use App\Http\Resources\ChecklistResource;
use App\Http\Services\ChecklistService;
use App\Models\Checklist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Request;
use Tests\TestCase;

class ChecklistUserControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * @test
     */
    public function testShowChecklistUser()
    {
        $checklistGroup = $this->createChecklistGroup();
        $checklist = $this->createChecklist($checklistGroup);
        
        $response = $this->actingAs($this->user)
            ->get(route('user.checklist.show', $checklist));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'tasks' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'position',
                        'completed_at',
                        'created_at',
                        'updated_at',
                    ]
                ],
            ]
        ]);
    }
}