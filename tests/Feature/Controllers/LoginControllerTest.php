<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test login functionality.
     *
     * @return void
     */
    public function testLogin()
    {
        // Create a mock user
        $user = User::create([
            'email' => 'test@gmail.com',
            'name' => 'Test User',
            'password' => bcrypt($password = 'test-password'),
        ]);

        // Make a POST request to the login route
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        // Assert that the response status is 302 (Redirect)
        $this->assertEquals(202, $response->getStatusCode());

        // Assert that the response contains a token
        $response->assertJsonStructure(['token']);

        // Assert that the user was authenticated
        $this->assertAuthenticatedAs($user);
    }

    public function testLoginWithoutToken()
    {
        $this->withoutExceptionHandling();
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->expectExceptionMessage('These credentials do not match our records.');

        $response = $this->post('/login', [
            'email' => 'some@gmail.com',
            'password' => 'some-password',
        ]);
    }
}