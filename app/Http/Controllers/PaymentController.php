<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class PaymentController extends Controller
{
    public function payment(Request $request, Client $client)
    {
        $data = [
            "orderCode" => now()->timestamp,
            "amount" => 5000,
            "description" => "Uyen",
            "cancelUrl" => config('services.payment.cancelUrl'),
            "returnUrl" => config('services.payment.returnUrl'),
        ];

        ksort($data);
        $secretKey = config('services.payment.checksum_key');
        $baseString = '';
        foreach ($data as $key => $value) {
            if ($key == 'cancelUrl' || $key == 'returnUrl') {
                // Don't URL encode these parameters
                $baseString .= "$key=$value&";
            } else {
                $baseString .= "$key=" . urlencode($value) . "&";
            }
        }
        $baseString = rtrim($baseString, '&');

        $signature = hash_hmac('sha256', $baseString, $secretKey);

        $data += [    
            "buyerName" => "Nguyen Van A",
            "buyerEmail" => "buyer-email@gmail.com",
            "buyerPhone" => "090xxxxxxx",
            "buyerAddress" => "số nhà, đường, phường, tỉnh hoặc thành phố",
            "items" => [
                [
                    "name" => "Iphone",
                    "quantity" => 1,
                    "price" => 5000
                ]
            ],
            'expiredAt' => now()->addMinutes(15)->timestamp,
            "signature" => $signature,
        ];

        $response = $client->request('POST', '/v2/payment-requests', [
            'headers' => [
                'x-client-id' => config('services.payment.client_id'),
                'x-api-key' => config('services.payment.api_key'),
            ],    
            'json' => $data,
        ]);

        $response = json_decode($response->getBody()->getContents(), true);

        if ($response['code'] != 00) {
            return response()->json(['message' => 'Payment failed'], 400);
        }

        Payment::create([
            'order_code' => $data['orderCode'],
            'amount' => $data['amount'],
            'description' => $data['description'],
            'payment_id' => $response['data']['paymentLinkId'],
            'status' => $response['data']['status'],
            'user_id' => $request->user()->id,
        ]);

        
        $result = [
            'checkoutUrl' => $response['data']['checkoutUrl'],
            'status' => $response['data']['status'],
        ];

        return response()->json(['message' => 'Payment successful', 'data' => $result], 200);
    }

    public function success(Request $request)
    {
        $payment = Payment::where('order_code', $request->orderCode)
            ->where('payment_id', $request->id)
            ->first();
        
        if (!$payment) {
            throw new \Exception('Payment not found');
        }

        if ($payment || $request->status == 'PAID') {
            $payment->update(['status' => $request->status]);
            $payment->user->update(['subscribe' => true]);
            return redirect('/dashboard');
        }

        return response()->json(['message' => 'Payment failed'], 400);
    }

    
    public function checkInvalid($transaction, $transaction_signature, $checksum_key)
    {
        ksort($transaction);
        $transaction_str_arr = [];
        foreach ($transaction as $key => $value) {
            if (in_array($value, ["undefined", "null"]) || gettype($value) == "NULL") {
                $value = "";
            }
  
            if (is_array($value)) {
                $valueSortedElementObj = array_map(function ($ele) {
                    ksort($ele);
                    return $ele;
                }, $value);
                $value = json_encode($valueSortedElementObj, JSON_UNESCAPED_UNICODE);
            }
            $transaction_str_arr[] = $key . "=" . $value;
        }
        $transaction_str = implode("&", $transaction_str_arr);
        $signature = hash_hmac("sha256", $transaction_str, $checksum_key);
        return $signature == $transaction_signature;
    }
}