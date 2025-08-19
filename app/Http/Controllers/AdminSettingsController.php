<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdminSettings;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminSettingsController extends Controller
{
    public function save(Request $request)
    {
        $data = $request->validate([
            'time_management' => 'nullable|integer|min:1',
            'access_days' => 'nullable|array',
            'access_times' => 'nullable|array',
            'display_management' => 'nullable|array',
        ]);

        $updateData = [];
        if (isset($data['time_management'])) {
            $updateData['time_management'] = $data['time_management'];
        }
        if (isset($data['access_days'])) {
            $updateData['access_days'] = json_encode($data['access_days']);
        }
        if (isset($data['access_times'])) {
            $updateData['access_times'] = json_encode($data['access_times']);
        }
        if (isset($data['display_management'])) {
            $updateData['display_management'] = json_encode($data['display_management']);
        }

        AdminSettings::updateOrCreate(
            ['user_id' => Auth::id()],
            $updateData
        );

        return back()->with('success', 'Settings saved successfully.');
    }
}
