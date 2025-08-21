<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminSettings extends Model
{

    protected $table = 'admin_setting';

    protected $fillable = [
        'user_id',
        'time_management',
        'access_days',
        'access_times',
        'display_management',
    ];

    protected $casts = [
        'access_days' => 'array',
        'access_times' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getSettings($years)
    {
        $adminUser = User::whereHas('roles', function ($query) {
            $query->where('id', 2)->orWhere('name', 'admin');
        })
            ->latest('id')
            ->first();

        if (!$adminUser) {
            return null;
        }

        $settings = self::first();

        if (!$settings) {
            $settings = new self();
            $settings->user_id = $adminUser->id;
            $settings->time_management = 35;
            $settings->access_days = json_encode([
                'monday' => true,
                'tuesday' => true,
                'wednesday' => true,
                'thursday' => true,
                'friday' => true,
                'saturday' => true,
                'sunday' => true,
            ]);
            $settings->access_times = json_encode([]);

            $displayManagement = [];
            foreach ($years as $year) {
                $months = [];
                for ($m = 1; $m <= 12; $m++) {
                    $months[$m] = true;
                }
                $displayManagement[$year] = $months;
            }


            $settings->display_management = json_encode($displayManagement);
            $settings->save();
        }

        return $settings;
    }
}
