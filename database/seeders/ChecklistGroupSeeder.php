<?php

namespace Database\Seeders;

use App\Models\Checklist;
use App\Models\ChecklistGroup;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChecklistGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $checklistGroups = ChecklistGroup::factory(2)->create();

        foreach ($checklistGroups as $checklistGroup) {
            $checklists = Checklist::factory(3)->create(['checklist_group_id' => $checklistGroup->id]);
            foreach ($checklists as $checklist) {
                Task::factory(3)->create(['checklist_id' => $checklist->id])
                    ->each(function ($task, $index) {
                        $task->update(['position' => $index]);
                    });
            }
        }
    }
}
