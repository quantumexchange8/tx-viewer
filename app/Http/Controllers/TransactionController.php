<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transactions;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function getTransactionsYear()
    {
        $years = Transactions::successful()
            ->select(DB::raw('DISTINCT YEAR(created_at) as year'))
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        return response()->json($years);
    }
}
