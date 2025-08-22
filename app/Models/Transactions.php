<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Transactions extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'user_id',
        'transaction_type',
        'amount',
        'transaction_amount',
        'status',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function scopeSuccessful($query)
    {
        return $query->where(function ($q) {
            $q->where('transaction_type', 'withdrawal')
                ->orWhere('transaction_type', 'deposit');
        })->where('status', 'successful');
    }


    public static function getAllTransactions()
    {
        $transactions = Transactions::successful()
            ->with('user.teams')
            ->whereNull('deleted_at')
            ->select(
                'id',
                'user_id',
                'from_meta_login',
                'to_meta_login',
                'transaction_type',
                'transaction_amount',
                'status',
                'created_at'
            )
            ->get()
            ->flatMap(function ($item) {
                $dt = Carbon::parse($item->created_at)->timezone('Asia/Shanghai');
                $item->year = $dt->year;
                $item->month = $dt->month;

                return $item->user->teams->map(function ($team) use ($item) {
                    $clone = clone $item;
                    $clone->team_id = $team->id;
                    return $clone;
                });
            })
            ->groupBy([
                fn($item) => $item->team_id,
                fn($item) => $item->year,
                fn($item) => $item->month,
            ]);

        return $transactions;
    }

    public static function getTeamTransactions($currentTeamID)
    {
        $transactions = Transactions::successful()
            ->whereHas('user.teams', function ($query) use ($currentTeamID) {
                $query->where('teams.id', $currentTeamID);
            })
            ->whereNull('deleted_at')
            ->select(
                'id',
                'user_id',
                'from_meta_login',
                'to_meta_login',
                'transaction_type',
                'transaction_amount',
                'status',
                'created_at'
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $dt = Carbon::parse($item->created_at)->timezone('Asia/Shanghai');
                $item->year = $dt->year;
                $item->month = $dt->month;
                return $item;
            })
            ->groupBy([
                fn($item) => $item->year,
                fn($item) => $item->month,
            ]);

        return $transactions;
    }
}
