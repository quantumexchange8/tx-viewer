<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\AdminSettings;
use App\Models\Team;
use App\Models\User;
use App\Models\Transactions;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
})->middleware('redirect.role')->name('directToLogin');

Route::get('/error', function () {
    return Inertia::render('Error/403Error');
})->name('error');

Route::middleware(['auth', 'verified'])->group(function () {

    // Admin routes
    Route::prefix('admin')
        ->name('admin.')
        ->middleware('role:admin')
        ->group(function () {
            Route::get('/dashboard', function () {

                $years = Transactions::successful()
                    // ->whereYear('created_at', '>=', 2025)
                    ->select(DB::raw('DISTINCT YEAR(created_at) as year'))
                    ->orderBy('year', 'desc')
                    ->pluck('year')
                    ->toArray();

                $settings = AdminSettings::getSettings($years);


                return Inertia::render('Admin/Dashboard', [
                    'settings' => $settings,
                    'years' => $years,
                ]);
            })->name('dashboard');

            Route::get('/getAllTeams', [TeamController::class, 'getAllTeams'])->name('getAllTeams');

            Route::get('/team/{team}', [TransactionController::class, 'adminDashboardDetails'])
                ->name('adminDashboardDetails');

            Route::get('/getAllTransactions', [TransactionController::class, 'getAllTransactions'])->name('getAllTransactions');

            Route::get('/getTeamTransactions', [TransactionController::class, 'getTeamTransactions'])->name('getTeamTransactions');

            Route::get('/settings', function () {
                $years = Transactions::successful()
                    // ->whereYear('created_at', '>=', 2025)
                    ->select(DB::raw('DISTINCT YEAR(created_at) as year'))
                    ->orderBy('year', 'desc')
                    ->pluck('year')
                    ->toArray();
                $settings = AdminSettings::getSettings($years);

                return Inertia::render('Admin/Settings', [
                    'settings' => $settings,
                    'years' => $years,
                ]);
            })->name('settings');
            Route::post('/settings/save', [AdminSettingsController::class, 'save'])
                ->name('settings.save');

            Route::post('/addTeam', [TeamController::class, 'addTeam'])->name('addTeam');
            Route::post('/updateTeam/{team}', [TeamController::class, 'updateTeam'])->name('updateTeam');

            Route::post('/removeTeam', [TeamController::class, 'removeTeam'])->name('removeTeam');


            Route::get('/teamSettings', function () {

                // Get IDs of all team leaders
                $leaderIDs = Team::pluck('team_leader_id');

                // Get all users except those leaders
                $teamLeaderOpt = User::whereNotIn('id', $leaderIDs)->get();

                return Inertia::render('Admin/TeamSettings', [
                    'teamLeaderOpt' => $teamLeaderOpt,
                ]);
            })->name('teamSettings');


            Route::get('/transactionSettings', function () {

                $years = Transactions::successful()
                    // ->whereYear('created_at', '>=', 2025)
                    ->select(DB::raw('DISTINCT YEAR(created_at) as year'))
                    ->orderBy('year', 'desc')
                    ->pluck('year')
                    ->toArray();

                $settings = AdminSettings::getSettings($years);

                return Inertia::render('Admin/TransactionSettings', [
                    'settings' => $settings,
                    'years' => $years,
                ]);
            })->name('transactionSettings');
        });

    // Team routes
    Route::prefix('team')
        ->name('team.')
        ->middleware(['role:team', 'team.access'])
        ->group(function () {

            Route::get('/getTransactions', [TransactionController::class, 'getTransactions'])->name('getTransactions');

            Route::get('/dashboard', function () {
                $years = Transactions::successful()
                    // ->whereYear('created_at', '>=', 2025)
                    ->select(DB::raw('DISTINCT YEAR(created_at) as year'))
                    ->orderBy('year', 'desc')
                    ->pluck('year')
                    ->toArray();
                $settings = AdminSettings::getSettings($years);

                return Inertia::render('Team/Dashboard', [
                    'settings' => $settings,
                    'years' => $years,
                ]);
            })->name('dashboard');
        });
});

require __DIR__ . '/auth.php';
