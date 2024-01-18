<?php

namespace Tests;

use App\Models\User;
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
}
