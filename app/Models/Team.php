<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $table = 'teams';

    protected $fillable = [
        'name',
        'team_account_id',
        'team_leader_id',
        'fee_charges',
        'color',
        'edited_by',
        'created_at'
    ];

    public function teamHasUsers()
    {
        return $this->hasMany(TeamHasUser::class, 'team_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'team_has_users', 'team_id', 'user_id');
    }

    // Add this for team leader
    public function leader()
    {
        return $this->belongsTo(User::class, 'team_leader_id');
    }

    public function accountUser()
    {
        return $this->belongsTo(User::class, 'team_account_id', 'id');
    }
}
