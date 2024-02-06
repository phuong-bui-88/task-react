<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;
use App\Notifications\TaskReminderNotification;

class SendTaskRemindsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-task-reminds';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get all tasks that are due today and send a reminder to the user
        $tasks = Task::where('remind_at', '<=',now()->format('Y-m-d'))
            ->where('remind_at', '!=', '')
            ->whereNotNull('user_id')->get();
        
        foreach ($tasks as $task) {
            $task->user->notify(new TaskReminderNotification($task));
            $task->remind_at = null;
            $task->save();
        }
    }
}
