<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Transactions;
use Illuminate\Support\Facades\DB;
use App\Models\AdminSettings;
use App\Models\Team;


class TransactionController extends Controller
{
    public function adminDashboardDetails($id)
    {
        $years = Transactions::successful()
            // ->whereYear('created_at', '>=', 2025)
            ->select(DB::raw('DISTINCT YEAR(created_at) as year'))
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();
        $settings = AdminSettings::getSettings($years);

        return Inertia::render('Admin/AdminDashboardDetails', [
            'settings' => $settings,
            'years' => $years,
            'id' => $id
        ]);
    }

    public function getTransactions()
    {
        $currentLoggedInID = Auth::id();

        $currentTeam = Team::where('team_account_id', $currentLoggedInID)->first();

        $transactions = Transactions::getTeamTransactions($currentTeam->id);

        return response()->json($transactions);
    }

    public function getAllTransactions()
    {
        $transactions = Transactions::getAllTransactions();
        return response()->json($transactions);
    }

    public function getTeamTransactions(Request $request)
    {
        $transactions = Transactions::getTeamTransactions($request->id);

        return response()->json($transactions);
    }
}
