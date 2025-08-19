<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return Inertia::render('index');
    }

    public function root(Request $request)
    {
        $page = str_replace('-', '', ucwords($request->path(), '-'));

        $pagePath = resource_path("js/Pages/{$page}.jsx");

        if (File::exists($pagePath)) {
            return Inertia::render($page);
        } else {
            abort(404);
        }
    }
}
