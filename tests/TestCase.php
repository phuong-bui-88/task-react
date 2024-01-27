<?php

namespace Tests;

use App\Models\Checklist;
use App\Models\User;
use App\Models\ChecklistGroup;
use App\Models\Task; 

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected $adminUser;
    protected $user;
    

    public function setUp() : void
    {
        parent::setUp();

        $this->adminUser = $this->createAdminUser();
        $this->user = $this->createUser();
    }

    public function createAdminUser() : User 
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function createUser() : User
    {
        return User::factory()->create(['is_admin' => false]);
    }

    public function createChecklistGroup()
    {
        return ChecklistGroup::factory()->create();
    }

    public function createChecklist($checklistGroup)
    {
        return Checklist::factory()->create(['checklist_group_id' => $checklistGroup->id]);
    }

    public function createTask($checklist)
    {
        return Task::factory()->create(['checklist_id' => $checklist->id]);
    }
}
