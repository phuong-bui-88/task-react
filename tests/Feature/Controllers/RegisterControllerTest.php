<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class RegisterControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function testRegister()
    {
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->post('/register', $userData);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);

        $this->assertDatabaseHas('users', [
            'name' => $userData['name'],
            'email' => $userData['email'],
        ]);
    }

    public function testRegisterValidation()
    {
        $this->withoutExceptionHandling();
        try {
            $response = $this->post('/register', []);
        } catch (ValidationException $e) {
            $this->assertEquals('The email field is required.', $e->validator->errors()->first('email'));
            $this->assertEquals('The name field is required.', $e->validator->errors()->first('name'));
            $this->assertEquals('The password field is required.', $e->validator->errors()->first('password'));
        }
    }

    public function testRegisterExistingEmail()
    {
        $this->withoutExceptionHandling();
        $existingUser = User::factory()->create();

        $userData = [
            'name' => $this->faker->name,
            'email' => $existingUser->email,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        try {
            $response = $this->post('/register', $userData);
        } catch (ValidationException $e) {
            $this->assertEquals('The email has already been taken.', $e->validator->errors()->first('email'));
        }
    }
}
