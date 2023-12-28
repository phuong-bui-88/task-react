<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::paginate(5);

        return UserResource::collection($users);
    }

    public function show(Request $request)
    {
        return new UserResource($request->user());
    }
}
