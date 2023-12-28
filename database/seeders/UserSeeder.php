<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'ghetrung1@gmail.com',
            'password' => bcrypt('12345678'),
            'is_admin' => true,
        ]);

        User::factory(10)->create([
            'is_admin' => false
        ]);
    }
}
