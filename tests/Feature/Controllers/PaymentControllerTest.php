<?php

namespace Tests\Feature\Controllers;

use App\Http\Controllers\PaymentController;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Mockery;
use Tests\TestCase;

class PaymentControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test payment request creation success.
     *
     * @return void
     */
    public function testCreatePayment()
    {
        // Create a payment request
        $paymentRequest = [
            'orderCode' => now()->timestamp,
            'amount' => 5000,
            'description' => 'Uyen',
            'cancelUrl' => config('services.payment.cancelUrl'),
            'returnUrl' => config('services.payment.returnUrl'),
            'buyerName' => 'Nguyen Van A',
            'buyerEmail' => 'buyer-email@gmail.com',
            'buyerPhone' => '090xxxxxxx',
            'buyerAddress' => 'số nhà, đường, phường, tỉnh hoặc thành phố',
            'items' => [
                [
                    'name' => 'Iphone',
                    'quantity' => 1,
                    'price' => 5000,
                ],
            ],
            'expiredAt' => now()->addMinutes(15)->timestamp,
        ];

        // Mock the Client object and its request method
        $mock = Mockery::mock(Client::class);
        $mock->shouldReceive('request')
            ->once()
            ->andReturn(new Response(200, [], json_encode([
                'code' => 00,
                'data' => [
                    'paymentLinkId' => 'test_payment_link_id',
                    'status' => 'pending',
                    'checkoutUrl' => 'http://example.com/checkout',
                ],
            ])));

        // Bind the mock object to the Client class in the service container
        $this->app->instance(Client::class, $mock);

        // Act as the user and make a POST request to the payment route
        $response = $this->actingAs($this->user)->post(route('payment'), $paymentRequest);

        // Assert that the response status is 200
        $response->assertStatus(200);

        // Assert that the response contains the expected data
        $response->assertJson([
            'message' => 'Payment successful',
            'data' => [
                'status' => 'pending',
                'checkoutUrl' => 'http://example.com/checkout',
            ],
        ]);

        // Assert that the payment request was saved to the database
        $this->assertDatabaseHas('payments', [
            'order_code' => $paymentRequest['orderCode'],
            'amount' => $paymentRequest['amount'],
            'description' => $paymentRequest['description'],
            'payment_id' => 'test_payment_link_id',
            'status' => 'pending',
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test payment request creation failure.
     *
     * @return void
     */
    public function testCreatePaymentFailure()
    {
        // Create a payment request
        $paymentRequest = [
            'orderCode' => now()->timestamp,
            'amount' => 5000,
            'description' => 'Uyen',
            'cancelUrl' => config('services.payment.cancelUrl'),
            'returnUrl' => config('services.payment.returnUrl'),
            'buyerName' => 'Nguyen Van A',
            'buyerEmail' => '',
            'buyerPhone' => '090xxxxxxx',
            'buyerAddress' => 'số nhà, đường, phường, tỉnh hoặc thành phố',
            'items' => [
                [
                    'name' => 'Iphone',
                    'quantity' => 1,
                    'price' => 5000,
                ],
            ],
            'expiredAt' => now()->addMinutes(15)->timestamp,
        ];

        // Mock the Client object and its request method
        $mock = Mockery::mock(Client::class);
        $mock->shouldReceive('request')
            ->once()
            ->andReturn(new Response(200, [], json_encode([
                'code' => 01,
            ])));

        // Bind the mock object to the Client class in the service container
        $this->app->instance(Client::class, $mock);

        // Act as the user and make a POST request to the payment route
        $response = $this->actingAs($this->user)->post(route('payment'), $paymentRequest);

        // Assert that the response status is 200
        $response->assertStatus(400);

        // Assert that the response contains the expected data
        $response->assertJson([
            'message' => 'Payment failed',
        ]);
    }

    /**
     * Test checkInvalid
     *
     * @return void
     */
    public function testCheckInvalidPayment()
    {
        // Create a payment request
        $data = [
            'orderCode' => now()->timestamp,
            'amount' => 5000,
            'description' => 'Uyen',
            'cancelUrl' => 'http://example.com/cancel',
            'returnUrl' => 'http://example.com/return',
        ];

        ksort($data);
        $secretKey = 'test_secret_key';
        $baseString = '';
        foreach ($data as $key => $value) {
            if ($key == 'cancelUrl' || $key == 'returnUrl') {
                // Don't URL encode these parameters
                $baseString .= "$key=$value&";
            } else {
                $baseString .= "$key=".urlencode($value).'&';
            }
        }
        $baseString = rtrim($baseString, '&');

        $signature = hash_hmac('sha256', $baseString, $secretKey);

        $ctl = new PaymentController();
        $this->assertTrue($ctl->checkInvalid($data, $signature, $secretKey));
    }
}
