<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transactions;
use Illuminate\Support\Facades\DB;
use App\Models\AdminSettings;

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

        $transactions = Transactions::getTeamTransactions($id);

        return Inertia::render('Admin/AdminDashboardDetails', [
            'settings' => $settings,
            'years' => $years,
            'transactions' => $transactions,
        ]);
    }
}
