<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = Auth::user();

        if (!$user || !$user->hasRole($role)) {
            // Redirect to their correct dashboard
            if ($user?->hasRole('admin')) {
                return redirect()->route('admin.dashboard');
            } elseif ($user?->hasRole('team')) {
                return redirect()->route('team.dashboard');
            }

            abort(403); // no valid role
        }

        return $next($request);
    }
}
