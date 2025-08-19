<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function scopeSuccessful($query)
    {
        return $query->where(function ($q) {
            $q->where('transaction_type', 'withdrawal')
                ->orWhere('transaction_type', 'deposit');
        })->where('status', 'successful');
    }
}
