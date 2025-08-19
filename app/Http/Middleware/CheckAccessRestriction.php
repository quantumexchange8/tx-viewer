<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminSettings;
use Carbon\Carbon;
use App\Models\Transactions;
use Illuminate\Support\Facades\DB;

class CheckAccessRestriction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        logger()->info('Middleware fired!');

        // Avoid running check on the error page itself
        if ($request->routeIs('error')) {
            return $next($request);
        }

        if ($user) {
            logger()->info('User logged in!');

            if ($user->hasRole('team')) {
                logger()->info('Team logged in!');
                $years = Transactions::successful()
                    ->select(DB::raw('DISTINCT YEAR(created_at) as year'))
                    ->orderBy('year', 'desc')
                    ->pluck('year')
                    ->toArray();

                $adminSettings = AdminSettings::getSettings($years);

                $accessDays = json_decode($adminSettings->access_days ?? '{}', true);
                $accessTimes = json_decode($adminSettings->access_times ?? '[]', true);

                $now = Carbon::now(); // current date/time
                $dayName = strtolower($now->format('l')); // e.g. "monday"

                logger()->info('Access check:', [
                    'current_day' => $dayName,
                    'current_time' => $now->toDateTimeString(),
                    'access_days' => $accessDays,
                    'access_times' => $accessTimes,
                ]);

                // Check if today is false in accessDays
                if (isset($accessDays[$dayName]) && $accessDays[$dayName] === false) {
                    logger()->info('Correct!');

                    // Check if current time falls inside any access range
                    foreach ($accessTimes as $range) {
                        [$start, $end] = $range;

                        $currentTime = $now->setTimezone('Asia/Shanghai')->format('H:i');
                        $startTimeOnly = Carbon::parse($start)->setTimezone('Asia/Shanghai')->format('H:i');
                        $endTimeOnly = Carbon::parse($end)->setTimezone('Asia/Shanghai')->format('H:i');

                        logger()->info('Access Time:', [
                            'currentTime' => $currentTime,
                            'endTimeOnly' => $endTimeOnly,
                            'startTimeOnly' => $startTimeOnly,
                        ]);

                        if ($currentTime >= $startTimeOnly && $currentTime <= $endTimeOnly) {
                            return redirect()->route('error');
                        }
                    }
                }
            }
        } else {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
