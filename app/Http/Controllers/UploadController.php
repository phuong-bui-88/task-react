<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $file->store('image', 'public');
            
            return response()->json([
                'url' => asset('storage/' . $path)
            ]);
        }
        
        return response()->json([
            'error' => 'No file uploaded.'
        ], 400);
    }
}
