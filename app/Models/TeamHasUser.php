<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamHasUser extends Model
{
    protected $table = 'team_has_users';

    protected $fillable = [];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
