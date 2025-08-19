<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddTeamRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class TeamController extends Controller
{
    public function addTeam(AddTeamRequest $request)
    {
        // Passed validation

        $adminID = Auth::id();

        $user = User::create([
            'first_name' => $request->teamName,
            'email' => strtolower(preg_replace('/\s+/', '', $request->teamName)) . "@gmail.com",
            'password' => Hash::make($request->password),
            'login_id'  => $request->loginID,
        ]);

        $user->assignRole("team");

        Team::create([
            'name' => $request->teamName,
            'fee_charges' => 0.00,
            'color' => "ffffff",
            'team_account_id' => $user->id,
            'team_leader_id' => $request->teamLeaderID,
            'edited_by' => $adminID,
        ]);
    }

    public function removeTeam(Request $request)
    {
        $request->validate([
            'teamID' => 'required|exists:teams,id',
        ]);

        $team = Team::find($request->teamID);

        $user = User::find($team->team_account_id);

        if ($user) {
            $user->removeRole('team');
            $user->delete();
        }

        $team->delete();
    }

    public function updateTeam(Request $request, Team $team)
    {

        $data = $request->validate([
            'teamName' => 'required|string|max:255',
            'loginID' => 'required|string|max:255',
            'teamLeaderID' => 'required|integer',
            'password' => 'nullable|confirmed|min:8',
        ]);

        $userAcc = User::find($team->team_account_id);

        $userUpdate = [
            'login_id' => $data['loginID'],
        ];

        if (!empty($data['password'])) {
            $userUpdate['password'] = Hash::make($data['password']);
        }

        // Update user account
        $userAcc->update($userUpdate);

        $teamUpdate = [
            'team_name'     => $data['teamName'],
            'team_leader_id' => $data['teamLeaderID'],
        ];

        // Update team
        $team->update($teamUpdate);
    }
}
