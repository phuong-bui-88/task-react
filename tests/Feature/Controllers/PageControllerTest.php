<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Page;
use Illuminate\Validation\ValidationException;

class PageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndexPage()
    {
        $pages = Page::factory()->count(3)->create();

        /** @var \Illuminate\Contracts\Auth\Authenticatable $adminUser */
        $response = $this->actingAs($this->user)->get('/api/pages');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function testShowPage()
    {
        $page = Page::factory()->create();

        $response = $this->actingAs($this->user)
                        ->get("/api/pages/{$page->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => $page->id,
            ]
        ]);
    }

    public function testUpdatePage()
    {
        $page = Page::factory()->create();
        $payload = [
            'title' => 'Updated Title',
            'content' => 'Updated Content'
        ];

        $response = $this->actingAs($this->adminUser)
                        ->put("api/pages/{$page->id}", $payload);
        $response->assertStatus(200);
        $page->refresh();
        $this->assertEquals('Updated Title', $page->title);
        $this->assertEquals('Updated Content', $page->content);
         
        // declide the user is not admin
        $response = $this->actingAs($this->user)
                        ->put("api/pages/{$page->id}", $payload);
        $response->assertStatus(403);

        // case title is empty
        $payload = [
            'title' => '',
            'content' => 'Updated Content'
        ];
        
        try {
            $response = $this->actingAs($this->adminUser)
                        ->put("api/pages/{$page->id}", $payload);
        } catch (ValidationException $e) {
            $this->assertEquals('The title field is required.', $e->validator->errors()->first('title'));
        }
    }

    public function testWelcome()
    {
        $page = Page::factory()->create(['id' => 1]);

        $response = $this->actingAs($this->user)->get('api/welcome');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => 1,
            ]
        ]);
    }

    public function testConsultation()
    {
        $page = Page::factory()->create(['id' => 2]);

        $response = $this->actingAs($this->user)->get('api/consulation');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => 2,
            ]
        ]);
    }
}
